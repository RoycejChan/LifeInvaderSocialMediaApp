# Life Invader 👁️

A social Media/Twitter Clone that has the basic features of any Social Sharing App.<br/>

Link to Project: <a src="https://lifein-e0258.web.app/">https://lifein-e0258.web.app/</a><br/>

<img src="https://i.gyazo.com/5bf05e995b5b6c2fe01c86e58fddad10.png" style="width:1500px; height:500px"/>



## 👇 Getting Started 👇<br/>


### How It's made:<br/>

**Tech used** 🖥️: <br/>
HTML, CSS, JavaScript, ReactJS, MaterialUI, Firebase/Store

- I first utilized HTML, CSS, and Javascript to create the foundational elements of the user Interface. <br/>
- I then used MaterialUI to give a more consistent and visualy appealing User Interface using their modern design components.<br/>
- Then I leveraged the capabilities of React by implementing modular components doing a component-based architecture, <br/>
  using practices such as code reusablity and maintability. The result was a highly interactive and responsive user interface that reacts to user actions.<br/>
<br/>
- Moving to the backend, Firebase plays the main role to data management and user authentication.<br/>
  It also Keep collections of indivudal useres and sub collections of each user, storing the user's likes, posts, replies, etc.<br/>
  It stores and rerieves user-content, their profile pictures, and thier logins.<br/>




## Lessons Learned and Final Thoughts 🧠:

Overall I am proud of the App I've coded, I've been able to implement good practices that I've missed on previous projects and also implemented new ones.<br/>
   ex.   Reusable functions = reduced redundacy<br/>
         Modularity: Breaking down the code into smaller, manageable pieces.<br/>
         Reusability: Functions can be used across different components, reducing redundancy.<br/>
         Readability: Keeping related functions separate improves readability and organization.<br/>

**If I could go back and redo some of the code,** i would <br/>
   keep the data consitent. As I wrote more code and implemented more of the user pages, I realized my data was inconsistent. For example, the user.uid(firebaseid) is referenced as user.id on some components, and I had to switch them back and forth to       get it right.<br/>
   In the future, I will keep my data conistent by planning how the data will be used in the future and keeping a structured template of the user.<br/>
   <br/>
   Another things that I would redo is the media queries. It is all in the mainfeed.css, forcing me to use !important alot. I did the components all at once in one file when I should have done them one at a time in their own components css file to          better organize it.
<br/>
   I also regret not noticing firebase had a real time database, I only used firestore, so some problems arised listed below



## Known bugs 🥲

   - Time Stamp on mainfeed, not showing, code is commented out and works when used, but interferes with another part of the code I forgot.<br/>
   - On profile tab, the users post id is different than mainfeed post id, so viewpost function cant find it RIP, data inconsistency and not planning ahead was my fault. The reason for this is beacuse I have a posts collection and a users -> user ->          posts collection. And firebase DB each db has its own id.<br/>
   - on inital load already check, if user refreshes their ui doesnt show they already liked a post. <br/>
   <br/>
        These Bugs are a result of me trying to work around not implementing real time database, so when a user posts or interacts with the post, it shows them their post or their comment, or like count changing in reeal time, but only for their                   computer, in order for that user to actually see the change, they have to refresh the page because its not real time.****
        Its something that I just did to make it seem more real time then having to refresh.<br/>
           - Posting/Commenting shows on that user's ui their post/comment, but clicking on it doesn't do anything because its just html/css/ no js until they refresh.



