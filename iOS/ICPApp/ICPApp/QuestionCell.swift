//
//  QuestionCell.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/3/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//

import UIKit

class QuestionCell: UITableViewCell {

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    @IBOutlet weak var questionText: UITextView!
    @IBOutlet weak var Slider: UISlider!
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
