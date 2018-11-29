// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
var debug = false;
function AppViewModel() {
    var self= this;
   var qrcode = new QRCode("qrcode");
    self.email=ko.observable('');
    self.password=ko.observable('');
    self.urlIP=ko.observable('http://52.202.147.130:5000');
    self.newname=ko.observable('');
    self.newemail=ko.observable('ak@a.com');
    self.newpassword=ko.observable('a');
    self.callback_webhook=ko.observable('');
    self.APIKey = ko.observable('');
    self.role = ko.observable('');
    self.isEdit = ko.observable(false);
    var table,evaluatorsTable;
    self.isDashboard = ko.observable(true);
  var token=  readCookie("token");
    self.token=ko.observable(token);
    self.adminName = ko.observable('Admin');

    self.logout=function () {
        eraseCookie("token");
        eraseCookie('role');
          self.token(null); self.role(null);
        window.location="index.html";
    }

    self.makeQRCode =function (params) {
        if(params==null || params ==''){
            params = self.newname();
        }
        qrcode.makeCode(params);
        $('#qrSpace').slideToggle();
    }
   
    self.toggleQRCodeDisplay= function (params) {
        $('#qrcode').toggle();
        $('#eyeIcon').toggleClass('fa-eye fa-eye-slash');
    }
    self.login = function() {

      var email= self.email();
      var password= self.password();
    if(email=="") {
      $.toast({heading:'error',text:'Username is required',icon:'error'});
      return;

  }
    if(password=="") {
      $.toast({heading:'error',text:'Password is required',icon:'error'});
      return;

  }
if(debug){
$('#login').hide();
$('#page').show();
self.getTeams();
    return;
}


    $.ajax({
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            email: self.email(),
            password:self.password() }),
            url: self.urlIP()+"/user/login",
           
            success: function(result) {
               
                if(result.status==200){
               
                $.toast({ heading: 'Success',
                text: result.message,
                  showHideTransition: 'slide',
                icon: 'success'});
                $('#login').hide();
                $('#page').show();
                console.log(result)
                createCookie("token",result.data.token,1);
               

               
                self.getTeams();
                
                
              
                }
                else{
                    $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
               
                }
                },
            error:
            function(result) {
                //Write your code here
                $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                }
        
      });
        // .done(function( data ) {
        //   alert( "welcome your token is = : " + data.token );
        // });

    }

//to create new evaluator
    self.register = function() {

        var email= self.email();
      var password= self.password();
    if(email=="") {
      $.toast({heading:'error',text:'Username is required',icon:'error'});
      return;

  }
    if(password=="") {
      $.toast({heading:'error',text:'Password is required',icon:'error'});
      return;

  }

      var callback_webhook= self.callback_webhook();
    if(callback_webhook=="") {
      $.toast({heading:'error',text:'Callback webhook is required',icon:'error'});
      return;

  }
    
      
    $.ajax({
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            email: self.email(),
            callback_webhook:self.callback_webhook(),
            password:self.password() }),
            
            url: self.urlIP()+"/user/signup",
           
            success: function(result) {
                //Write your code here
                if(result.status==200){
                //self.token(result.token);
                console.log(result);
               self.APIKey( result.data.apiKey);
                $.toast({ heading: 'Success',
                text: result.message,
                  showHideTransition: 'slide',
                icon: 'success'});
                window.login="index.html";                
                }
                else{
                    if(result.status==200 )
                    $.toast({heading:'error',text:'Invalid User only admin is allowed to use this portal.', icon: 'error'});
                    else 
 
                    $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
              

                }
                },
            error:
            function(result) {
                //Write your code here

                $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                }
        
      });
        // .done(function( data ) {
        //   alert( "welcome your token is = : " + data.token );
        // });

    }
    self.dashboardTab = function(params) {
        self.isDashboard(true);
        self.getTeams();
    }
    self.teamsTab = function(params) {
        self.isDashboard(false);
        self.getTeams();
    }
    self.evaluatorsTab = function(params) {
        self.isDashboard(true);
        self.getEvaluators();
    }
//to get all the teams data
self.getTeams=function(){
    $.ajax({
        method: "GET",
        contentType: 'application/json',
        headers: {"Authorization": "BEARER "+readCookie('token')},
       
            url: self.urlIP()+ "/user/getTeam",
           
            success: function(result) {
                //Write your code here
                if(result.status==200){
                //self.token(result.token);
             
                self.showTeams(result.data);
                }
                else{
                    console.log('not getting status');
                    console.log(result);
                    $.toast({heading:'error',text:result.message, icon: 'error'});
                }
                },
            error:
            function(result) {
                //Write your code here
                $.toast({heading:'error',text:result.message,icon:'error'});
                }
        
      });
  
}
self.getEvaluators = function(){
    $.ajax({
        method: "GET",
        contentType: 'application/json',
        headers: {"Authorization": "BEARER "+readCookie('token')},
       
            url: self.urlIP()+ "/user/getEvaluatorsList",
           
            success: function(result) {
                //Write your code here
                if(result.status==200){
                self.showEvaluators(result.data);
                }
                else{
                    console.log('not getting status');
                    console.log(result);
                    $.toast({heading:'error',text:result.message, icon: 'error'});
                }
                },
            error:
            function(result) {
                //Write your code here
                $.toast({heading:'error',text:result.message,icon:'error'});
                }
        
      });
  
}
self.showTeams = function(data) {
    self.showTeamTable(data);
    console.log(readCookie('token'))
}
self.showEvaluators = function(data) {
    self.showEvaluatorsTable(data);
}
     //make ajax call to api to get the data required to show the data tables.
  
    self.showTeamTable= function(tabledata) {
     // console.log(table);
        $('#teams').fadeIn( 2000);
        if(table == null ){
        table=$('#teamstable').DataTable( {
            data: tabledata, 
            columns: [
                { data: '_id', title:'Team ID' },
                { data: 'teamName',title:'Team' },
                { data: 'score',title:'Average Score' },
                { data: 'numberOfEval' ,title:'#Evaluations'}
            ]
        } );
        $('#teamstable tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
                $('#editTeam').addClass('disabled')
                $('#deleteTeam').addClass('disabled');

            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                $('#editTeam').removeClass('disabled');
                $('#deleteTeam').removeClass('disabled');

            }
        } );
        }
        else{
           //see how to update table
          // $('#teamstable').DataTable().draw();
            table.clear();
            table.rows.add(tabledata).draw();
        }
        

        // $('#table_id tbody').on( 'click', 'tr', function () {
        //     if ( $(this).hasClass('selected') ) {
        //         $(this).removeClass('selected');
        //     }
        //     else {
        //         table.$('tr.selected').removeClass('selected');
        //         $(this).addClass('selected');
        //      //   alert('show user details');
        //      //find the userid and surveyid admin clicked
        //     var userid= this.cells[1].innerHTML;
        //     var sid = this.cells[2].innerHTML;
        //     createCookie("uid",userid);
        //     //createCookie("sid",sid);
        //      window.location="SurveyDetail.html";
             
        //      self.getUserDetailSurvey();
        //     }
        // } );
        
    } 
    self.showEvaluatorsTable= function(tabledata) {
        // console.log(table);
           $('#evaluators').fadeIn( 2000);
           if(evaluatorsTable == null)
           evaluatorsTable=$('#evaluatorsTable').DataTable( {
               data: tabledata, 
               columns: [
                   { data: '_id', title:'ID' },
                   { data: 'username',title:'Name' },
                   { data: 'email',title:'Email' },
                   
               ]
           } );
           
   
           // $('#table_id tbody').on( 'click', 'tr', function () {
           //     if ( $(this).hasClass('selected') ) {
           //         $(this).removeClass('selected');
           //     }
           //     else {
           //         table.$('tr.selected').removeClass('selected');
           //         $(this).addClass('selected');
           //      //   alert('show user details');
           //      //find the userid and surveyid admin clicked
           //     var userid= this.cells[1].innerHTML;
           //     var sid = this.cells[2].innerHTML;
           //     createCookie("uid",userid);
           //     //createCookie("sid",sid);
           //      window.location="SurveyDetail.html";
                
           //      self.getUserDetailSurvey();
           //     }
           // } );
           
       }
    self.showUsers=function (params) {
        $('#usertable').fadeIn(2000);
        $('#userDetail').hide();
    }
    self.getUserDetailSurvey =function (params) {
        //ajax to bring the user survey
        //$('#teams').hide();
        $('#userDetail').fadeIn(2000);
//on success call 
self.showUserDetailTable();
    }
self.showUserDetailTable= function (tabledata) {
    $('#usertable').fadeIn( 2000);
        var detailTable=$('#table_Detail').DataTable( {
            data: tabledata,
            dom: 'Bfrtip',
            columns: [
                { data: 'name', title:'Name' },
                { data: '_id',title:'UserId' },
                { data: 'surveyId',title:'SurveyId' },
                { data: 'score' ,title:'Score'}
            ],
            buttons: [{
                extend: 'pdf',
                text: 'Print ',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
            }
            ]
        } );
}

    self.saveUser = function (isEdit) {
        //add user ajax to be called here
       
        $.ajax({
            method: "POST",
            contentType: 'application/json',
            
            data: JSON.stringify({
                name:self.newname(),
                email: self.newemail(),
                password:self.newpassword(),
            age:"10",
        weight: "10",
    address: "US" }),
                url: "http://18.223.110.166:5000/user/signup",
               
                success: function(result) {
                    //Write your code here
                    if(result.status==200){
                    //self.token(result.token);
                    $.toast({ heading: 'Success',
                    text: result.message,
                      showHideTransition: 'slide',
                    icon: 'success'});
        $('#addUser').slideToggle("slow");
                
                    //self.getData();
                    self.makeQRCode();
                    }
                    else{
                        $.toast({heading:'error',text:result.message, icon: 'error'});
                    }
                    },
                error:
                function(result) {
                    //Write your code here
                    $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                    }
            
          });
            // .done(function( data ) {
            //   alert( "welcome your token is = : " + data.token );
            // });
    
        

    }
    self.saveTeam = function (isEdit) {
        //add user ajax to be called here'
        if(isEdit){
            self.editTeam();
            return;
        }

        console.log(readCookie('token'))
        $.ajax({
            method: "POST",
            contentType: 'application/json',
        headers: {"Authorization": "BEARER "+readCookie('token')},
            data: JSON.stringify({
                teamName:self.newname(),
                }),
                url: self.urlIP()+ "/user/registerTeam",
               
                success: function(result) {
                    //Write your code here
                    if(result.status==200){
                    //self.token(result.token);
                    $.toast({ heading: 'Success',
                    text: result.message,
                      showHideTransition: 'slide',
                    icon: 'success'});
                    console.log('team data')
                    console.log(result.data);

                     $('#addUser').slideToggle("slow");
                
                    //self.getData();
                    self.makeQRCode(result.data.teamId);
                    self.getTeams();
                    }
                    else{
                        $.toast({heading:'error',text:result.message, icon: 'error'});
                    }
                    },
                error:
                function(result) {
                    //Write your code here
                    $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                    }
            
          });
            // .done(function( data ) {
            //   alert( "welcome your token is = : " + data.token );
            // });
    
        

    }
    self.showeditForm= function(){
        self.isEdit(!self.isEdit());
        var teamName= table.row('.selected').data().teamName;
        self.newname(teamName)
        $('#addTeam').slideToggle( "slow");
    }
    self.editTeam = function () {
        //add user ajax to be called here
        var teamId= table.row('.selected').data()._id;
        var teamName =self.newname();
        $.ajax({
            method: "POST",
            contentType: 'application/json',
        headers: {"Authorization": "BEARER "+readCookie('token')},
            data: JSON.stringify({
                teamName:teamName,
                teamId: teamId
                }),
                url: self.urlIP()+ "/user/editTeam",
               
                success: function(result) {
                    //Write your code here
                    if(result.status==200){
                    //self.token(result.token);
                    $.toast({ heading: 'Success',
                    text: result.message,
                      showHideTransition: 'slide',
                    icon: 'success'});
                     $('#addUser').slideToggle("slow");
                     self.getTeams();
                     self.showeditForm();
                
                    }
                    else{
                        $.toast({heading:'error',text:result.message, icon: 'error'});
                    }
                    },
                error:
                function(result) {
                    //Write your code here
                    $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                    }
            
          });
            // .done(function( data ) {
            //   alert( "welcome your token is = : " + data.token );
            // });
    
        

    }
    self.deleteTeam = function () {
        //add user ajax to be called here
        var teamId= table.row('.selected').data()._id;
        console.log(teamId)
        $.ajax({
            method: "DELETE",
            contentType: 'application/json',
            headers: {"Authorization": "BEARER "+readCookie('token')},
            url: self.urlIP()+ "/user/deleteTeam/"+teamId,
               
                success: function(result) {
                    //Write your code here
                    if(result.status==200){
                    //self.token(result.token);
                    $.toast({ heading: 'Success',
                    text: result.message,
                      showHideTransition: 'slide',
                    icon: 'success'});
                    self.getTeams();
                    self.disableButtons();
                    $('#qrSpace').hide();
                    }
                    else{
                        $.toast({heading:'error',text:result.message, icon: 'error'});
                    }
                    },
                error:
                function(result) {
                    //Write your code here
                    $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                    }
            
          });
          
    
        

    }
self.disableButtons=function(){
    $('#editTeam').addClass('disabled')
    $('#deleteTeam').addClass('disabled');

}
self.showTeamForm= function(){
    self.newname('');
    $('#addTeam').slideToggle( "slow");
}

// self.hideUserForm= function(){
//     $('addUser').hide( "slow");
// }

//initialisation of the page goes here
$('#qrSpace').hide();

if((self.token()==null || self.token()=="")){
$('#page').hide();

}else{
    //self.getData();
    self.getTeams();
    $('#page').show();
}

$('#addTeam').hide();


//dummy data to be deleted later
var data = [
    {
        "_id":       "23",
        "teamName":   "System Architect",
        "score":     "$3,120",
        "numberOfEval": "2011/04/25"
    },
    {
        "_id":       "Tiger Nixon",
        "teamName":   "System Architect",
        "score":     "$3,120",
        "numberOfEval": "2011/04/25"
    }
    
];

}

ko.applyBindings(new AppViewModel());

function createCookie(name, value, days) {
    // var expires;

    // if (days) {
    //     var date = new Date();
    //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    //     expires = "; expires=" + date.toGMTString();
    // } else {
    //     expires = "";
    // }
    // document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    window.localStorage.setItem(name,value);
}

function readCookie(name) {
    // var nameEQ = encodeURIComponent(name) + "=";
    // var ca = document.cookie.split(';');
    // for (var i = 0; i < ca.length; i++) {
    //     var c = ca[i];
    //     while (c.charAt(0) === ' ')
    //         c = c.substring(1, c.length);
    //     if (c.indexOf(nameEQ) === 0)
    //         return decodeURIComponent(c.substring(nameEQ.length, c.length));
    // }
    return window.localStorage.getItem(name);
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


// Activates knockout.js


