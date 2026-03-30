import Message from '../models/Message.model.js';
import User from '../models/User.model.js';

// @desc    Get all messages for a room
// @route   GET /api/messages/dm/:roomId
// @access  Private
const getDmMessages = async (req, res) => {
  try {
    const messages = await Message.find({ dmRoom: req.params.roomId })
      .populate('sender', 'name avatarId _id')
      .sort({ createdAt: 'asc' });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all messages for a group
// @route   GET /api/messages/group/:groupId
// @access  Private
const getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate('sender', 'name avatarId _id')
      .sort({ createdAt: 'asc' });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get the user's chat list (DMs ONLY)
// @route   GET /api/messages/my-chats
// @access  Private
const getChatList = async (req, res) => {
  try {
    const userId = req.user._id;
    const allChatsMap = new Map();

    // --- 1. DM LOGIC ---
    const dmMessages = await Message.find({
      dmRoom: { $regex: new RegExp(userId.toString()) },
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatarId _id');

    for (const msg of dmMessages) {
      if (!allChatsMap.has(msg.dmRoom)) {
        const idParts = msg.dmRoom.split('__');
        const otherUserId = idParts[0].toString() === userId.toString() ? idParts[1] : idParts[0];
        
        // Fetch the other user's info
        const otherUser = await User.findById(otherUserId).select('name avatarId');

        if (otherUser) {
          allChatsMap.set(msg.dmRoom, {
            roomType: 'dm',
            roomId: msg.dmRoom,
            lastMessage: msg,
            displayUser: {
              _id: otherUser._id,
              name: otherUser.name,
              avatarId: otherUser.avatarId,
            },
          });
        }
      }
    }

    // --- 2. CONVERT & SORT ---
    const allChats = [...allChatsMap.values()];
    
    allChats.sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    res.json(allChats);
  } catch (error) {
    console.error('getChatList error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getDmMessages, getGroupMessages, getChatList };


















































//



























































































































































































































































































//const prompt = require("prompt-sync")();
// console.log("Hello, World!")
// let a=20
// let b="abcd"
// console.log(a+b)
// console.log(typeof(a+b))
// const a1={
//     name:"xyz",
//     "age":20
// }
// console.log(a1.name)
// console.log(a1["name"])
// console.log(a1["age"])
// console.log(a1.age)

//day 2

// let a = prompt("Enter your age:");
// a = Number.parseInt(a);

// if (a > 18) {
//     alert("You can drive");
// } else {
//     alert("You cannot drive");
// }

// day 3

// const expr = "Papayas";
// switch (expr) {
//   case "Oranges":
//     console.log("Oranges are $0.59 a pound.");
//     break;
//   case "Mangoes":
//   case "Papayas":
//     console.log("Mangoes and papayas are $2.79 a pound.");
//     // Expected output: "Mangoes and papayas are $2.79 a pound."
//     break;
//   default:
//     console.log(`Sorry, we are out of ${expr}.`);
// }

// let a = prompt("Enter age: ");
// a = Number.parseInt(a);

// console.log(a);
// let a = prompt("Enter your age:");
// if (a > 18) {
//     alert("You can drive");
// } else {
//     alert("You cannot drive");
// }

// let a = prompt("Enter your age: ");
// a = Number.parseInt(a);
// console.log(a>18?"You can drive":"You cannot ddrive");
// for  (let i = 0; i < 10; i++){
//     console.log(i);
// }
// let a={
//     s:"abc",
//     b:"def",
//     c:"ghi",
//     d:"jkl"

// }
// for (let i in a)
//      console.log(i+" is key and "+a[i]+" is value  pair");

// function  sum(a,b){
//     let c=a+b;
//     return c;
// }
// console.log(sum(1,2));

// const b=(x,y)=>{
//     console.log(x+y);
// }
// b(1,2);

// let s=[13, 2, 23, 45 ,77, 54]
// console.log (s)
// console.log(s.shift())
// console.log  (s)
// console.log(s.unshift(1))
// console.log(s)

// let a = [61, 52, 3, 54, 65, 556, 57, 68, 9, 110]
// let c = ["sell", "r", "e", "w", "u", "a", "b", "r"];
// // let compare = (a, b) => {
// //     return a - b;
// // };
// console.log(c.sort());
// let a = [61, 52, 3, 54, 65, 556, 57, 68, 9, 110]
// let a2 =a.reverse()
// console.log(a2)
// console.log(a)

// let a = [61, 52, 3, 54, 65, 556, 57, 68, 9, 110]
// a.splice(100)
// console.log( a)

// let  a = [61, 52, 3, 54, 65, 556, 57, 68, 9, 110]
// let b = a.slice(2,5)
// console.log(b)
// console.log(a)

// let a=[];
// for(let i=0;i<3;i++)
//   {
//     let b=prompt("Enter "+(i+1)+" index number: ");
//     a.push(Number.parseInt(b))
//   }
// console.log(a)
// a.pop()
// console.log(a)
// a.push(44)
// console.log(a)

// let a=[];
// var c=1
// while(c!=0)
//   {
//     var b=prompt("Enter "+(c)+" index number: ");
//     a.push(Number.parseInt(b))
//     c++
//   }
// console.log(a)

//  let c=1;
//  let arr=[];
// let b;
// do{
//     b=prompt("Enter "+(c)+" index number: ");
//     arr.push(Number.parseInt(b))
//     c++
//   }while(b!=0)
// console.log(arr)


// let arr=[];
// let i=0
// while(i<5){
// let x= prompt("Enter number: ")
//   arr.push(Number.parseInt(x))
// arr=arr.filter((x)=>{
//     return x%10==0;
// })
//   i++
// }
// console.log(arr)

// let arr=[1,20,13,40,15,60,71,80,91,10]
// let a=arr.filter((x)=>{
//     return x%10==0;
// })
// console.log(arr)
// console.log(a)

//day 6


// alert("Hello")
// console.log("Hey harry")

// obj = {a:1,b:2,c:3,d:4}
// console.table(obj)

// console.log("log")
// console.info("info")
// console.warn("warn")
// console.error("err")
// console.assert("err" != false)
// console.assert("err" == false)

// console.time("forLoop")

// for (let i = 0; i < 500; i++) {
//   console.log(233)
// }

// console.timeEnd("forLoop")

// console.time("whileLoop")

// let i = 0;
// while (i < 500) {
//   console.log(233)
//   i++;
// }

// console.timeEnd("whileLoop")


// console.log(window)
// console.log(document)
// console.log(document.body)
//location.href= "https://google.com" ---> redirect to google from my website


// function getRandom() {
//   return Math.random();
// }
// console.log(getRandom());


// function getRandomArbitrary(min, max) {
//   return Math.random() * (max - min) + min;
// }
// // console.log(getRandomArbitrary(1, 100));
// // console.log(getRandomArbitrary(1, 5));
// const prompt = require("prompt-sync")();
// let a =Math.round(getRandomArbitrary(1, 100))
// let b=true
// let count =0
// let guess
// while (b==true)
//   {
//     guess=prompt("enter you number")
//     count+=1
//     if (guess==a)
//     {
//       console.log("you guessed it right")
//       console.log(`you took ${count} attempts`)
//       console.log(`your score is ${100-count}`)
//       break
//     }
//     else
//     {
//       if (guess>a){console.log("your number is greater than the actual number")}
//       else{console.log("your number is smaller than the actual number")}
//       console.log("try again")

//     }

//   }*/