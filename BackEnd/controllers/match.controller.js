import User from '../models/User.model.js';
import Post from '../models/Post.model.js';
import mongoose from 'mongoose';
import {
    getExpandedUserKeywords,
    calculateAdvancedScore,
    getSearchTerms
} from '../utils/match.utils.js';

// ==========================================
// 3. RECOMMEND POSTS (/api/v1/posts/recommend-posts)
// ==========================================

export const recommendPosts = async (req, res) => {
    const userId = req.query.user_id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const rawDomains = user.domains || [];
        const expandedKeywords = getExpandedUserKeywords(rawDomains);

        const posts = await Post.find({}).lean();
        const now = new Date();

        let rankedPosts = [];

        for (const post of posts) {
            const postTags = post.tags || [];
            const likesCount = post.likes ? post.likes.length : 0;
            const created = post.createdAt;

            let totalScore = 0;
            const relevanceScore = calculateAdvancedScore(expandedKeywords, postTags, rawDomains);
            totalScore += relevanceScore;

            const popularityPoints = Math.min(likesCount * 2, 500);
            totalScore += popularityPoints;

            const daysOld = Math.floor((now - created) / (1000 * 60 * 60 * 24));
            totalScore -= (daysOld * 10);

            if (postTags.length === 0) {
                totalScore -= 500;
            }

            rankedPosts.push({
                post,
                score: totalScore,
                debug: {
                    relevance: relevanceScore,
                    popularity: popularityPoints,
                    age_penalty: daysOld * 10
                }
            });
        }

        rankedPosts.sort((a, b) => b.score - a.score);
        const topPosts = rankedPosts.slice(0, 30);

        // Fetch authors for the top posts
        const postIds = topPosts.map(item => item.post._id);
        const postsWithAuthor = await Post.find({ _id: { $in: postIds } })
            .populate('author', 'name avatarId')
            .lean();

        // Map back to maintain order and add debug info
        const finalResults = postsWithAuthor.map(p => {
            const scoredItem = topPosts.find(item => item.post._id.equals(p._id));

            // Convert ObjectIds to strings for the frontend
            p.likes = p.likes.map(id => id.toString());
            p._score_breakdown = scoredItem ? scoredItem.debug : {};

            return p;
        });

        res.json({ recommended: finalResults });

    } catch (error) {
        console.error("Error in recommendPosts:", error);
        res.status(500).json({ message: 'Failed to generate post recommendations.' });
    }
};

// ==========================================
// 4. FIND PARTNER (/api/v1/partners/find-partner)
// ==========================================

export const findPartner = async (req, res) => {
    const { user_id: currentUserId, domain: domainOverride, study_time: timeOverride, team_pref: teamOverride } = req.query;

    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }
    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId);

    try {
        const searcher = await User.findById(currentUserId).lean();
        if (!searcher) {
            return res.status(404).json({ message: "Searching user profile not found" });
        }

        const searchTime = timeOverride ? timeOverride.toLowerCase() : searcher.studyTime ? searcher.studyTime.toLowerCase() : null;
        const searchTeam = teamOverride ? teamOverride.toLowerCase() : searcher.teamPref ? searcher.teamPref.toLowerCase() : null;
        const searchDomains = Array.isArray(domainOverride) ? domainOverride : (domainOverride ? [domainOverride] : (searcher.domains || []));


        const targetSkills = getSearchTerms(searchDomains);
        const targetSkillsSet = new Set(targetSkills);

        const rawCandidates = await User.find(
            { _id: { $ne: currentUserIdObj } },
            { password: 0, email: 0 }
        ).lean();

        let scoredCandidates = [];

        for (const candidate of rawCandidates) {
            let score = 0;
            let debugReasons = [];

            // 1. Score Skills 
            const candidateDomains = new Set((candidate.domains || []).map(d => d.toLowerCase()));
            let numMatches = 0;

            targetSkillsSet.forEach(targetSkill => {
                if (candidateDomains.has(targetSkill)) {
                    numMatches++;
                }
            });

            if (numMatches > 0) {
                score += (numMatches * 100);
                debugReasons.push(`${numMatches} Skill Match(es)`);
            }

            // 2. Score Study Time (50 points)
            if (searchTime) {
                const candTime = candidate.studyTime;
                if (candTime && candTime.toLowerCase() === searchTime) {
                    score += 50;
                    debugReasons.push("Time Match");
                } else if (searchTime === "flexible" && candTime) {
                    score += 10;
                }
            }

            // 3. Score Team Preference (30 points)
            if (searchTeam) {
                const candTeam = candidate.teamPref;
                if (candTeam && candTeam.toLowerCase() === searchTeam) {
                    score += 30;
                    debugReasons.push(`${searchTeam.charAt(0).toUpperCase() + searchTeam.slice(1)} Match`);
                }
            }

            // 4. Profile Bonus (5 points)
            if (candidate.bio) {
                score += 5;
                debugReasons.push("Has Bio");
            }

            scoredCandidates.push({
                user: candidate,
                score: score,
                reasons: debugReasons
            });
        }

        // Sort and format output
        scoredCandidates.sort((a, b) => b.score - a.score);

        const finalResults = scoredCandidates.slice(0, 50).map(item => {
            const user = item.user;
            user._match_score = item.score;
            user._match_reasons = item.reasons;
            return user;
        });

        res.json({ matches: finalResults });

    } catch (error) {
        console.error("Error in findPartner:", error);
        res.status(500).json({ message: 'Failed to find study partners.' });
    }
};