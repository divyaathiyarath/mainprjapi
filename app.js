const Express=require('express');
var app=new Express();
app.use(Express.static(__dirname+"/public"));
var bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
var request=new require('request');
var mongoose=require('mongoose');
// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://edppapi.herokuapp.com' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// //checking connection
// mongoose.connect("mongodb://localhost:27017/hospital",{ useNewUrlParser: true });


// mongoose.connect("mongodb://localhost:27017/hospital" , { useNewUrlParser: true }).then(
//   (res) => {
//    console.log("Connected to Database Successfully.")
//   }
// ).catch(() => {
//   console.log("Conntection to database failed.");
// });
mongoose.connect("mongodb+srv://mongodb:mongodb@mycluster-rfooj.mongodb.net/test?retryWrites=true&w=majority");
var LogModel=mongoose.model("login",{
    username:String,
    password:String,
    utype:String
});

var DoctorModel=mongoose.model("doctor",{
    name:String,
    qualification:String,
    category:String,
    mailid:String,
    phone:String,
 

});
var PatientModel=mongoose.model("patient",{
    name:String,
    age:String,
    mailid:String,
    password:String
  
});

var BookingModel=mongoose.model("booking",{
    doctor:String,
    patient:String,
    date:String,
    time:String,
    token:String
});

var WdaysModel=mongoose.model("wdays",{
   doctor:String,
   date:String,
   time:String 
});

var PrescriptionModel=mongoose.model("prescription",{
    patient:String,
    prescription:String
});

var TokenModel=mongoose.model("token",{
    token:String
});

// Api to check mail id

app.post('/checkMailApi',(req,res)=>{

  console.log(req.body.mailid);
  //var ma=req.params.mail.value;
 //console.log(mail);
    LogModel.find({username:req.body.mailid},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            console.log("mailapi"+data);
            res.send(data);
        }
    })
})

//Api to view patient details

app.get('/viewPatientApi/:user',(req,res)=>{

    console.log("viewPatientApi");
    console.log(req.params.user);

    PatientModel.find({mailid:req.params.user},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            
            res.send(data);
        }
    })
})

//Api to check login details

app.post('/readLogApi',(req,res)=>{

    LogModel.find({$and:[{username:req.body.username},{password:req.body.password}]},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            console.log(data);
            res.send(data);
        }
    })

})

//Api to register doctor
app.post('/readDoctorApi',(req,res)=>
{
    var docdata=new DoctorModel(req.body);
    var logdata=new LogModel();
    logdata.username=req.body.mailid;
    logdata.password=req.body.password;
    logdata.utype="doctor";
  
    docdata.save((error)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            res.send(docdata);
        }
    });

     
   var ldata=logdata.save((error)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            res.send(ldata);
        }
    });


 });

//Api to view doctor details

app.get('/viewDoctorApi',(req,res)=>{

    DoctorModel.find((error,data)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            res.send(data);
        }
    })
})



app.post('/readpatient',(req,res)=>{
   // console.log(req.body);
    var patdata=new PatientModel(req.body);
    var logdata=new LogModel();
    logdata.username=req.body.mailid;
    logdata.password=req.body.password;
    logdata.utype="patient";

    logdata.save((error)=>{

        if(error)
        {
            throw error;
        }
    });


    patdata.save((error)=>
    {
        if(error)
        {
           
            throw error;
        }
        else
        {
         
           console.log(patdata);
            res.send(patdata);
        }
    });

});

//Api to update patient

app.post('/updatePatientApi',(req,res)=>{

     console.log("Api");
     console.log(req.body[0].mailid);
 username=req.body[0].mailid;
    PatientModel.findOneAndUpdate({_id:req.body[0]._id},req.body[0],(error,response)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            
            LogModel.update({username:username},{$set:{password:req.body[0].password}},(error,response)=>{
                if(error)
                {
                    throw error;
                }
                else
                {
                    res.send(response);
                }
            })
           // res.send(response);
        }
    });
});

//Api to update doctor

app.post('/updateDoctorApi',(req,res)=>{

    console.log("Api");
   console.log(req.body[0].name);
    DoctorModel.findOneAndUpdate({_id:req.body[0]._id},req.body[0],(error,response)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(response);
            }
    });
});
//Api to add working days

app.post('/addWdaysApi',(req,res)=>{

     var wday=new WdaysModel(req.body);
    wday.save((error)=>{
        if(error)
        {
            throw error;
        }
        else
        {
            res.send(wday);
        }
    })
})


// app.post('/readbooking',(req,res)=>{

//     var bdata=new BookingModel(req.body);
//     bdata.save((error)=>{
//         if(error)
//         {
//             throw error;
//         }else{
//             res.send(bdata);
//         }
//     });
// });

//Api to read working days

app.get('/getWorkingDaysApi',(req,res)=>{

    var ts=new Date();
    var cdate=ts.toLocaleDateString();
    console.log(cdate);
    month = '' + (ts.getMonth() + 1),
    day = '' + ts.getDate(),
    year = ts.getFullYear();

   if (month.length < 2) 
    month = '0' + month;
   if (day.length < 2) 
    day = '0' + day;

    da=[year, month, day].join('-');
    console.log(da);


    
    //  db.wdays.find({date:{$gte:"2019-09-15"}}).pretty();
    WdaysModel.find({date:{$gte:da}},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(data);
          
            }
    });
});

//Api to book doctor

app.post('/BookingApi',(req,res)=>{
BookingModel.find({date:req.body.date},(error,data)=>{

     var token;

    if(error)
    {
        throw error;
    }
    else
    {
        console.log(data.length);
        if(data.length!=4)
        {
            
        //token

        TokenModel.find((error,data)=>{
            if(error)
            {
                throw error;
            }
            else
            {
                token=data[0].token;
               
           
                if(token=='4')
                {
                  
                
                    TokenModel.update({token:token},{$set:{token:1}},(error)=>{

                        if(error)
                        {
                            throw error;
                        }

                    });

                }
                else
                {
                    t=(parseInt(token));
                    tok=t+1;
                    TokenModel.update({token:token},{$set:{token:tok}},(error)=>{
                        if(error)
                        {
                            throw error;
                        }
                    })
                }
               
            }

       
        })


        //
      
     
         console.log("Token"+token);
         var booking=new BookingModel();
         booking.doctor=req.body.doctor;
         booking.date=req.body.date;
         booking.time=req.body.time;
         booking.patient=req.body.patient;
         booking.token=data.length+1;

            booking.save((error)=>{
            if(error)
            {
            throw error;
            }
            else{
            console.log(booking);
            res.send(booking);
            
             }
            }) 

        }
        else{
            res.send(null);
        }

    }

        })

})

//Api to view patients
app.get('/viewPatientsApi',(req,res)=>{

    PatientModel.find((error,data)=>{
        if(error)
        {
            throw error
        }
        else{
            res.send(data);
        }
    })
})

//Api to add prescription

app.post('/prescriptionApi',(req,res)=>
{
 //console.log(req.body.patient);
    PrescriptionModel.find({patient:req.body.patient},(error,data)=>{
                 if(error)
                 {
                     throw error;
                 }
                 else
                 {
                     console.log(data.length);
                     res.send(data);
                     }
                    })   
 })

 app.post('/addPrescriptionApi',(req,res)=>{
    
    PrescriptionModel.find({patient:req.body.patient},(error,data)=>{
                 if(error)
                 {
                     throw error;
                 }
                 else
                 {
                     console.log(data.length);
                     if(data.length==0)
                     {
                         var prescription=new PrescriptionModel(req.body);
                         prescription.save((error)=>{
                             if(error)
                             {
                                 throw error;
                             }
                             else{
                                 res.send(prescription);
                             }
                         })
                     }
                     else
                     {
                       PrescriptionModel.findOneAndUpdate({patient:req.body.patient},req.body,(error,response)=>{
                           if(error)
                           {
                               throw error;
                           }
                           else
                           {
                               res.send(response);
                           }
        
                       })
                     }
                 }
             });


 })

 //view prescription for patients

 app.get('/viewPrescriptionApi/:user',(req,res)=>{

     var patient=req.params.user;
    PrescriptionModel.find({patient:patient},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(data);
        }
    })
 })

 //Api to view bookings
 app.get('/viewBookingApi',(req,res)=>{

    var ts=new Date();
    var cdate=ts.toLocaleDateString();
    console.log(cdate);
    month = '' + (ts.getMonth() + 1),
    day = '' + ts.getDate(),
    year = ts.getFullYear();

   if (month.length < 2) 
    month = '0' + month;
   if (day.length < 2) 
    day = '0' + day;

    da=[year, month, day].join('-');
 
     BookingModel.find({date:da},(error,data)=>{
      if(error)
      {
          throw error;

      }
      else
      {
        res.send(data);

    }

     })


 })

 //Api to view token
 app.get('/viewTokenApi/:patient',(req,res)=>{

    var patient=req.params.patient;
    BookingModel.find({patient:patient},(error,data)=>{
        if(error)
        {
            throw error;
        }
        else{
            res.send(data);
        }
    })

 })
app.listen(3000,()=>
{
 
    console.log("Server is running on port 3000");
})