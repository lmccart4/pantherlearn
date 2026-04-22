const a=require("firebase-admin");a.initializeApp({projectId:"pantherlearn-d6f7c"});
const db=a.firestore();
(async()=>{
  const d=(await db.doc("courses/physics/lessons/electrostatics-w31-material-matters").get()).data();
  console.log("title:",d.title,"| order:",d.order,"| visible:",d.visible,"| gradesReleased:",d.gradesReleased);
  d.blocks.forEach((b,i)=>{
    const text=b.prompt||b.title||b.content||b.url||b.instructions||"";
    console.log(`[${i}] ${b.type}${b.questionType?`/${b.questionType}`:""}  ${String(text).slice(0,100).replace(/\n/g," ")}`);
  });
  process.exit(0);
})();
