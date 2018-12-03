//
//  answerSlider.swift
//  ICPApp
//
//  Created by Ankit Kelkar on 12/3/18.
//  Copyright © 2018 Ankit Kelkar. All rights reserved.
//

import UIKit

public class answerSlider: UISlider {

    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
*/
    
    var label: UILabel
    var labelXMin: CGFloat?
    var labelXMax: CGFloat?
    var labelText: ()->String = { "" }
    
    required public init(coder aDecoder: NSCoder) {
        label = UILabel()
        super.init(coder: aDecoder)!
        self.addTarget(self, action: "onValueChanged:", for: .valueChanged)
        
    }
    func setup(){
        labelXMin = frame.origin.x + 16
        labelXMax = frame.origin.x + self.frame.width - 14
        var labelXOffset: CGFloat = labelXMax! - labelXMin!
        var valueOffset: CGFloat = CGFloat(self.maximumValue - self.minimumValue)
        var valueDifference: CGFloat = CGFloat(self.value - self.minimumValue)
        var valueRatio: CGFloat = CGFloat(valueDifference/valueOffset)
        var labelXPos = CGFloat(labelXOffset*valueRatio + labelXMin!)
        label.frame = CGRect(x:labelXPos,y:self.frame.origin.y - 25,width: 200,height: 25)
        label.text = self.value.description
        self.superview!.addSubview(label)
        
    }
    func updateLabel(){
        label.text = labelText()
        var labelXOffset: CGFloat = labelXMax! - labelXMin!
        var valueOffset: CGFloat = CGFloat(self.maximumValue - self.minimumValue)
        var valueDifference: CGFloat = CGFloat(self.value - self.minimumValue)
        var valueRatio: CGFloat = CGFloat(valueDifference/valueOffset)
        var labelXPos = CGFloat(labelXOffset*valueRatio + labelXMin!)
        label.frame = CGRect(x:labelXPos - label.frame.width/2,y:self.frame.origin.y - 25, width:200, height:25)
        label.textAlignment = NSTextAlignment.center
        self.superview!.addSubview(label)
    }
    public override func layoutSubviews() {
        labelText = { self.value.description }
        setup()
        updateLabel()
        super.layoutSubviews()
        super.layoutSubviews()
    }
   
}
