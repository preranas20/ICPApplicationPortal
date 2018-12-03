//
//  Result.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/3/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//
import SwiftyJSON
import Foundation
class Result {
//    // "evalId": "Ohm eval",
//
//    "teamId": "Ohm team",
//
//    "qId": "2",
//    "text": "question2",
//    "surveyId": 0,
//    "answer": 4
    var evalId: String = ""
    var teamId:String = ""
    let qId:String
    let text : String
    let surveyId:String
    var answer:Int = 1
    var orderId:String
    init(qId:String,text:String,surveyId:String ,answer:Int,orderId:String){
        
        self.qId = qId;
        self.text = text
        self.surveyId = surveyId
        self.answer = answer
        self.orderId = orderId
        
    }
    init?(json: JSON) {
        
            let qId = json["qId"]
            let orderId = json["orderId"]
            let text = json["qText"]
            let surveyId = json["surveyId"]
        
        
        self.qId = String(qId.stringValue);
        self.text = text.stringValue
        self.surveyId = surveyId.stringValue
        self.orderId = orderId.stringValue
    }

}
