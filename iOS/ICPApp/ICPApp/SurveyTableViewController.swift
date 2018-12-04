//
//  SurveyTableViewController.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/3/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class SurveyTableViewController: UITableViewController {
 let RemoteIp:String = "http://52.202.147.130:5000/"
    var questions:NSArray = [];
    var swiftyJson: JSON = []
    var teamId: String = ""
    var name:String = ""
    var resultArray :[Result] = []
    override func viewDidLoad() {
        super.viewDidLoad()
         self.navigationItem.title = self.name
getQuestions()
      
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
        
    }
    @IBAction func backButton(_ sender: Any) {
        self.dismiss(animated: true) {
            
        }
    }
    func getQuestions() {
        let headers: HTTPHeaders = [
            "Authorization": "Bearer \(self.readToken()) "
        ]
        Alamofire.request("\( RemoteIp)user/getAllQuestions", headers:headers).responseJSON {  (response) in
            switch response.result {
            case .success:
                
                if let json = response.result.value {
                    self.swiftyJson = JSON(json)
                    print(self.swiftyJson)
                    // self.teams = self.swiftyJson["data"] as! NSArray
                    let j = json as! NSDictionary
                    // print("JSON: \(j)")
                    self.questions = j["data"] as! NSArray
                    //     print(self.teams.count)
                    for (key,subJson):(String, JSON) in  self.swiftyJson["data"] {
                        // Do something you want
                        print(subJson)
                        print(subJson["qId"])
                          print(subJson["qText"])
                          print(subJson["surveyId"])
                          print(subJson["orderId"])
                        let res:Result = Result(json:subJson)!
                       res.teamId = self.teamId
                       self.resultArray.append(res)
                    }
                    //self.saveToken(token: token)
                    print("Validation Successful")
                    self.tableView.reloadData()
                }
            case .failure(_):
                print("some error occured")
            }
        }
        
    }
    func readToken()-> String{
        let defaults = UserDefaults.standard
        let token = defaults.string(forKey: "token")
        return token ?? "";
    }
    
    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return self.resultArray.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "surveyCell", for: indexPath) as! QuestionCell
            cell.Slider.tag = indexPath.row
        cell.questionText.text = self.swiftyJson["data"][indexPath.row]["qText"].stringValue
        
        // Configure the cell...

        return cell
    }
    
    @IBAction func SliderValueChanged(_ sender: UISlider) {
      //set the value of object and call save survey api
       
        let val: Int =  Int((sender.value).rounded(.down)); sender.setValue(Float(val), animated: true)
       
         self.resultArray[sender.tag].answer = val
        
    }
    
    @IBAction func SaveSurveyClicked(_ sender: Any) {
        var jData: [Any] = []
        for item in resultArray {
            let js = item.toJSON()
            jData.append(js)        }
       // guard let data = try? JSONSerialization.data(withJSONObject: jData, options: []) else {
     //       print("error in json conversion")
     //       return
     //   }
    //    let jd = String(data: data, encoding: String.Encoding.utf8)
     //
        
            let parameters: Parameters = [
                "data": jData
                
            ]
            Alamofire.request("\(RemoteIp)user/saveSurvey", method: .post, parameters: parameters, encoding: JSONEncoding.default).responseJSON { response in
                switch response.result {
                case .success:
                    self.saveDone()
                    print("savedScore")
                case .failure(_):
                    print("some error occured")
                }
            }
            
        
     
    }
    func saveDone() ->Void {
        let storyBoard : UIStoryboard = UIStoryboard(name: "Main", bundle:nil)
        let nextViewController = storyboard!.instantiateViewController(withIdentifier: "teamsVC") as! TeamsTableViewController
        self.present(nextViewController, animated:true, completion:nil)
    }
    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
