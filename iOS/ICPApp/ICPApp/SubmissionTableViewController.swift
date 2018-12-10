//
//  SubmissionTableViewController.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/9/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//

import UIKit

class SubmissionTableViewController: UITableViewController {
    var teamId: String = ""
    var   selectedName : String = ""
    var questions : [Result] = []
    override func viewDidLoad() {
        super.viewDidLoad()
print(questions)
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
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
        return questions.count
    }


    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "questionsCell", for: indexPath)

       let question = cell.viewWithTag(10) as! UILabel
        // Configure the cell...
question.text = questions[indexPath.row].qtext
        let answer = cell.viewWithTag(20) as! UILabel
        answer.text = String(questions[indexPath.row].answer)
        return cell
    }
    
    @IBAction func Resubmit(_ sender: Any) {
        performSegue(withIdentifier:"resubmitSegue" , sender: self)
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let dest = segue.destination as! SurveyTableViewController
        dest.teamId = self.teamId;
        dest.name = self.selectedName
    }
    
    @IBAction func back(_ sender: Any) {
        self.dismiss(animated: true) {
            
        }
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
