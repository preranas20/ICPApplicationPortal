const express = require("express"); // like import to a variable
const router = express.Router();

const UserController = require('../controllers/user');
const UserProfile = require('../controllers/profile');
const workFlowController = require('../controllers/workFlow');
const TeamControlller = require('../controllers/team');

//new apis
router.post("/login", UserController.user_login);
router.get("/details",checkAuth, UserProfile.getTeam);
router.get("/devloperlist",checkAuth, UserProfile.getEvaluatorsList);


const checkAuth = require('../middleware/check-auth');

router.post("/registerEvaluator", UserController.create_evaluator);



//team
router.post("/registerTeam", TeamControlller.createTeam);

// show developers-details and logs


router.post("/showlogs",checkAuth, UserProfile.showLogs);
router.get("/showdevices",checkAuth, UserProfile.showDevices);
router.post("/recivedToGateway",workFlowController.receivedMessage);
;
//To test stubs:
router.post("/addMessage", UserProfile.addMessage);
router.post("/addDevice",checkAuth, UserProfile.addDevice);
//fcm server routes
router.post("/sendToDevice",workFlowController.SendToDevice);

router.put("/profile/edit",checkAuth,UserProfile.editProfile);

router.delete("/:userId", checkAuth, UserController.user_delete);
module.exports = router;
