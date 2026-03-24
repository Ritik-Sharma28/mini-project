export const DOMAIN_KNOWLEDGE_BASE = {
    "web": [
        "html", "html5", "css", "css3", "javascript", "js", "es6", "typescript", "ts",
        "react", "reactjs", "vue", "vuejs", "angular", "svelte", "nextjs", "nuxtjs", "tailwind", "bootstrap", "material ui",
        "node", "nodejs", "express", "django", "flask", "fastapi", "spring boot", "laravel", "php", "ruby on rails",
        "frontend", "backend", "fullstack", "api", "rest", "graphql", "websockets", "pwa", "npm", "yarn", "webpack"
    ],
    "game": [
        "unity", "unreal engine", "unreal", "godot", "gamemaker", "cryengine",
        "c#", "c++", "lua", "blueprint",
        "gamedev", "level design", "shaders", "vfx", "physics", "rendering", "3d modeling", "blender", "maya",
        "sprite", "animation", "multiplayer", "npc", "navmesh", "raytracing", "opengl", "vulkan", "directx"
    ],
    "ai": [
        "artificial intelligence", "ml", "machine learning", "dl", "deep learning", "neural networks",
        "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "pandas", "numpy", "opencv", "huggingface",
        "nlp", "computer vision", "reinforcement learning", "gan", "llm", "gpt", "transformer", "bert", "diffusion models",
        "chatbot", "predictive", "data science", "algorithm", "model training", "dataset", "supervised", "unsupervised"
    ],
    "cybersecurity": [
        "hacking", "ethical hacking", "penetration testing", "pentest", "red team", "blue team", "soc", "ciso",
        "firewall", "vpn", "network security", "wireshark", "nmap", "packet tracer", "tcp/ip", "dns",
        "crypto", "cryptography", "encryption", "malware", "ransomware", "phishing", "social engineering", "exploit",
        "vulnerability", "bug bounty", "owasp", "kali linux", "metasploit", "zero day", "auth", "oauth", "jwt"
    ],
    "cloud": [
        "aws", "amazon web services", "azure", "gcp", "google cloud", "digitalocean", "heroku", "vercel", "netlify",
        "docker", "kubernetes", "k8s", "container", "podman",
        "devops", "ci/cd", "pipeline", "serverless", "lambda", "microservices", "terraform", "ansible", "jenkins",
        "linux", "bash", "shell", "scalability", "load balancing", "cdn", "s3", "ec2"
    ],
    "dsa": [
        "array", "linked list", "stack", "queue", "hash map", "hash table", "tree", "binary tree", "bst", "heap", "graph", "trie",
        "sorting", "searching", "recursion", "dynamic programming", "dp", "greedy", "backtracking", "divide and conquer",
        "leetcode", "codeforces", "hackerrank", "competitive programming", "cp", "big o", "time complexity", "space complexity",
        "binary search", "dfs", "bfs", "dijkstra", "prim", "kruskal", "interview prep", "coding interview"
    ]
};

export const getSearchTerms = (domainQueries) => {
    const expandedSearchSet = new Set();
    if (!domainQueries || domainQueries.length === 0) return [];

    for (const userQuery of domainQueries) {
        const queryClean = userQuery.toLowerCase().trim();
        expandedSearchSet.add(queryClean);

        if (DOMAIN_KNOWLEDGE_BASE[queryClean]) {
            DOMAIN_KNOWLEDGE_BASE[queryClean].forEach(term => expandedSearchSet.add(term));
        }

        for (const domain in DOMAIN_KNOWLEDGE_BASE) {

            if (DOMAIN_KNOWLEDGE_BASE[domain].includes(queryClean)) {
                expandedSearchSet.add(domain);
            }
        }
    }
    return Array.from(expandedSearchSet);
};

export const getExpandedUserKeywords = (userDomains) => {
    const expandedSet = new Set();
    for (const domain of userDomains) {
        const d_clean = domain.toLowerCase().trim();
        expandedSet.add(d_clean);
        if (DOMAIN_KNOWLEDGE_BASE[d_clean]) {
            DOMAIN_KNOWLEDGE_BASE[d_clean].forEach(keyword => expandedSet.add(keyword));
        }
    }
    return expandedSet;
};

export const calculateAdvancedScore = (expandedKeywords, postTags, userRawDomains) => {
    let score = 0;
    const postTagsClean = postTags.map(t => t.toLowerCase().trim());
    const userRawSet = new Set(userRawDomains.map(d => d.toLowerCase()));

    for (const tag of postTagsClean) {
        // 1. Raw Domain Match (Highest weight)
        if (userRawSet.has(tag)) {
            score += 1500;
            continue;
        }
        // 2. Expanded Keyword Match (High weight)
        if (expandedKeywords.has(tag)) {
            score += 800;
            continue;
        }
        // 3. Partial/Substring Match (Medium weight)
        for (const keyword of expandedKeywords) {
            if (keyword.length > 2 && tag.length > 2) {
                if (keyword.includes(tag) || tag.includes(keyword)) {
                    score += 200;
                    break;
                }
            }
        }
    }
    return score;
};
