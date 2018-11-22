// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI

function AppViewModel() {
    var self= this;
   // var qrcode = new QRCode("qrcode");
    self.email=ko.observable('');
    self.password=ko.observable('');
    self.urlIP=ko.observable('http://18.223.110.166:5000');
    self.newname=ko.observable('ankit');
    self.newemail=ko.observable('ak@a.com');
    self.newpassword=ko.observable('a');
    self.callback_webhook=ko.observable('');
    self.APIKey = ko.observable('');
    self.role = ko.observable('');
  var token=  readCookie("token");
    self.token=ko.observable(token);
    self.adminName = ko.observable('Admin');

    self.logout=function () {
        eraseCookie("token");
        eraseCookie('role');
          self.token(null); self.role(null);
        window.location="index.html";
    }

    self.registerclick=function(){
        window.location="Register.html";
    }
    self.makeQRCode =function (params) {
        qrcode.makeCode(self.newemail()+"_SEPERATOR_"+self.newpassword());
        $('#qrSpace').show();
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

    $.ajax({
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            email: self.email(),
            password:self.password() }),
            url: self.urlIP()+"/user/login",
           
            success: function(result) {
                //Write your code here
                if(result.status==200){
                //self.token(result.token);
                $.toast({ heading: 'Success',
                text: result.message,
                  showHideTransition: 'slide',
                icon: 'success'});
                $('#login').hide();
                createCookie("token",result.token,1);
                createCookie("role",result.role,1);

                if(result.role=="admin")
                self.getData();
                else{
                    window.location="SurveyDetail.html";
                }
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

     //make ajax call to api to get the data required to show the data tables.
        self.getData= function(params) {
            //on the success of ajax call showTable method by passing data
            $.ajax({
                method: "GET",
                contentType: 'application/json',
                headers: {"Authorization": "BEARER "+readCookie('token')},
               
                    url: self.urlIP()+ "/user/devloperlist",
                   
                    success: function(result) {
                        //Write your code here
                        if(result.status==200){
                        //self.token(result.token);
                        console.log('not getting status');
                        console.log(result);
                        self.showTable(result.data);
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
                        $.toast({heading:'error',text:result.responseJSON.message,icon:'error'});
                        }
                
              });
          
        }
    self.showTable= function(tabledata) {
      
        $('#usertable').fadeIn( 2000);
        var table=$('#table_id').DataTable( {
            data: tabledata,
           
            columns: [
                { data: 'email', title:'Email' },
                { data: '_id',title:'UserId' },
                { data: 'APIKey',title:'APIkey' },
                { data: 'callback_webhook' ,title:'Webhook'}
            ]
        } );

        $('#table_id tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
             //   alert('show user details');
             //find the userid and surveyid admin clicked
            var userid= this.cells[1].innerHTML;
            var sid = this.cells[2].innerHTML;
            createCookie("uid",userid);
            //createCookie("sid",sid);
             window.location="SurveyDetail.html";
             
             self.getUserDetailSurvey();
            }
        } );
        
    }
    self.showUsers=function (params) {
        $('#usertable').fadeIn(2000);
        $('#userDetail').hide();
    }
    self.getUserDetailSurvey =function (params) {
        //ajax to bring the user survey
        $('#usertable').hide();
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

    self.saveUser = function () {
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

self.showUserForm= function(){
    $('#addUser').slideDown( "slow");
}
// self.hideUserForm= function(){
//     $('addUser').hide( "slow");
// }

//initialisation of the page goes here
$('#qrSpace').hide();

if((self.token()==null || self.token()=="")){
$('#usertable').hide();}else{
    self.getData();
}

$('#addUser').hide();


//dummy data to be deleted later
var data = [
    {
        "name":       "Tiger Nixon",
        "position":   "System Architect",
        "salary":     "$3,120",
        "start_date": "2011/04/25",
        "office":     "Edinburgh",
        "extn":       "5421"
    },
    {
        "name":       "Garrett Winters",
        "position":   "Director",
        "salary":     "$5,300",
        "start_date": "2011/07/25",
        "office":     "Edinburgh",
        "extn":       "8422"
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


