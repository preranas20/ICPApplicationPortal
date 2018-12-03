//
//  TeamsTableViewController.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/3/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//
import UIKit
import QRCodeReader
import AVFoundation
import Alamofire
import SwiftyJSON

class TeamsTableViewController: UITableViewController ,QRCodeReaderViewControllerDelegate {
    var selectedTeam: String = ""
    var teams:NSArray = [];
    var swiftyJson: JSON = []
    let RemoteIp:String = "http://52.202.147.130:5000/";
    override func viewDidLoad() {
       
        super.viewDidLoad()
         self.getTeams()
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    @IBAction func Logout(_ sender: Any) {
        self.saveToken(token: "")
        UserDefaults.standard.set(true, forKey: "status")
        Switcher.updateRootVC()
        
    }
    func getTeams() {
    let headers: HTTPHeaders = [
        "Authorization": "Bearer \(self.readToken()) "
    ]
    Alamofire.request("\(RemoteIp)user/getTeam", headers:headers).responseJSON {  (response) in
            switch response.result {
            case .success:
                
                if let json = response.result.value {
                    self.swiftyJson = JSON(json)
                    print(self.swiftyJson)
                   // self.teams = self.swiftyJson["data"] as! NSArray
                    let j = json as! NSDictionary
                  // print("JSON: \(j)")
                  self.teams = j["data"] as! NSArray
               //     print(self.teams.count)
                    
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
    
    func saveToken(token:String){
        let defaults = UserDefaults.standard
        defaults.set(token, forKey: "token")
    }
    //QRCode specific
    
    // initialization and each time we need to scan a QRCode
    var readerVC: QRCodeReaderViewController = {
        let builder = QRCodeReaderViewControllerBuilder {
            $0.reader = QRCodeReader(metadataObjectTypes: [.qr], captureDevicePosition: .back)
        }
        
        return QRCodeReaderViewController(builder: builder)
    }()
    
    func reader(_ reader: QRCodeReaderViewController, didScanResult result: QRCodeReaderResult) {
        reader.stopScanning()
        
        dismiss(animated: true) { [weak self] in
            let alert = UIAlertController(
                title: "QRCodeReader",
                message: String (format:"%@ (of type %@)", result.value, result.metadataType),
                preferredStyle: .alert
            )
            alert.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))
            
            self?.present(alert, animated: true, completion: nil)
        }
    }
    
    
    func readerDidCancel(_ reader: QRCodeReaderViewController) {
        reader.stopScanning()
        
        dismiss(animated: true, completion: nil)
    }
    private func checkScanPermissions() -> Bool {
        do {
            return try QRCodeReader.supportsMetadataObjectTypes()
        } catch let error as NSError {
            let alert: UIAlertController
            
            switch error.code {
            case -11852:
                alert = UIAlertController(title: "Error", message: "This app is not authorized to use Back Camera.", preferredStyle: .alert)
                
                alert.addAction(UIAlertAction(title: "Setting", style: .default, handler: { (_) in
                    DispatchQueue.main.async {
                        if let settingsURL = URL(string: UIApplication.openSettingsURLString) {
                            UIApplication.shared.openURL(settingsURL)
                        }
                    }
                }))
                
                alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
            default:
                alert = UIAlertController(title: "Error", message: "Reader not supported by the current device", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))
            }
            
            present(alert, animated: true, completion: nil)
            
            return false
        }
    }
    @IBAction func scanInModalAction(_ sender: AnyObject) {
        guard checkScanPermissions() else { return }
        
        readerVC.modalPresentationStyle = .formSheet
        readerVC.delegate               = self
        
        readerVC.completionBlock = { (result: QRCodeReaderResult?) in
            if let result = result {
                print("Completion with result: \(result.value) of type \(result.metadataType)")
            }
        }
        
        present(readerVC, animated: true, completion: nil)
    }
    
    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return ((self.teams.count))
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "teamCell", for: indexPath)
        let teamName = cell.viewWithTag(1) as! UITextField
        let team = self.swiftyJson["data"][indexPath.row]
        
       teamName.text = team["teamName"].stringValue
        let score = cell.viewWithTag(2) as! UITextField
        score.text = team["score"].stringValue
      
        // Configure the cell...

        return cell
    }
    
  override  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    self.selectedTeam = self.swiftyJson["data"][indexPath.row]["_id"].stringValue
        self.performSegue(withIdentifier: "showSurvey", sender: self)
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let dest = segue.destination as! SurveyTableViewController
        dest.teamId = self.selectedTeam;
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
