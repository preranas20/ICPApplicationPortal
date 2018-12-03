//
//  Result.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/3/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//

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
    let evalId: String
    let teamId:String
    let qId:String
    let text : String
    let surveyId:Int
    let answer:Int
    init(teamId:String,qId:String,text:String,surveyId:Int,answer:Int){
        self.teamId = teamId;
        self.qId = qId;
        self.text = text
        self.surveyId = surveyId
        self.answer = answer
        self.evalId = ""
        
    }
}
