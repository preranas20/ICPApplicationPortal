const express = require("express"); // like import to a variable
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');
const UserProfile = require('../controllers/profile');
const workFlowController = require('../controllers/workFlow');
const TeamControlller = require('../controllers/team');

//new apis
router.post("/login", UserController.user_login);
router.get("/getTeam", TeamControlller.getTeam);
router.get("/getEvaluatorsList",checkAuth, UserProfile.getEvaluatorsList);
//router.post("/editEvaluator",checkAuth,UserProfile.editEvaluator);
router.delete("/:userId", checkAuth, UserProfile.user_delete);
router.post("/createQuestion",UserProfile.createQuestion);
router.post("/editQuestion",UserProfile.editQuestion);

//put back chk auth in btw + savesurvey chnge ctrler
router.post("/saveSurvey",UserController.saveSurvey);


router.post("/registerTeam",checkAuth,TeamControlller.createTeam);

router.post("/deleteQuestion", UserProfile.deleteQuestion);
router.get("/getAllQuestions",UserProfile.getAllQuestions);
router.post("/getResultForTeams",UserProfile.getResultForTeams);
router.post("/registerEvaluator",checkAuth,UserController.create_evaluator);

router.post("/registerTeam",checkAuth,TeamControlller.createTeam);
router.post("/editTeam",checkAuth,TeamControlller.editTeam);
router.post("/loginQRCode",UserController.loginQRCode);
router.delete("/deleteTeam/:id",checkAuth,TeamControlller.deleteTeam);


// show developers-details and logs


//router.post("/showlogs",checkAuth, UserProfile.showLogs);
//router.get("/showdevices",checkAuth, UserProfile.showDevices);
//router.post("/recivedToGateway",workFlowController.receivedMessage);

//To test stubs:
//router.post("/addMessage", UserProfile.addMessage);
//router.post("/addDevice",checkAuth, UserProfile.addDevice);
//fcm server routes
//router.post("/sendToDevice",workFlowController.SendToDevice);

//router.put("/profile/edit",checkAuth,UserProfile.editProfile);


module.exports = router;
