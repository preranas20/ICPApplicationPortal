//
//  LoginViewController.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/2/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//

import UIKit
import QRCodeReader
import AVFoundation
import Alamofire

class LoginViewController: UIViewController ,QRCodeReaderViewControllerDelegate {
    
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var email: UITextField!
    let RemoteIp:String = "http://52.202.147.130:5000/";
    override func viewDidLoad() {
        
        super.viewDidLoad()
       
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    @IBAction func LoginPressed(_ sender: Any) {
        let parameters: Parameters = [
            "email": email.text!,
            "password": password.text!,
            "isPortal":false
            
        ]
        Alamofire.request("\(RemoteIp)user/login", method: .post, parameters: parameters, encoding: JSONEncoding.default).responseJSON { response in
            switch response.result {
            case .success:
                
                if let json = response.result.value {
                   let JSON = json as! NSDictionary
                   // print("JSON: \(JSON)")
                    let data = JSON["data"] as! NSDictionary;
                    let token = data["token"] as! String;
                   self.saveToken(token: token)
                   UserDefaults.standard.set(false, forKey: "status")
                print("Validation Successful")
           self.performSegue(withIdentifier: "showTeams", sender: self)
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
    
}

