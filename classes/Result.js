const keys = require('../keywords/keys')

const Result = function(wordObjects){
    let recipientLocationField = wordObjects.filter(w=>{
        return w.key.includes(keys.recipient_location_field) && w.confidence>=w.threshold
    })
    recipientLocationField = recipientLocationField.map(w=>w.string)
    this.recipientLocationField = recipientLocationField.join(' ')

    let recipientLocationValue = wordObjects.filter(w=>{
        return w.key.includes(keys.recipient_location_value) && w.confidence>=w.threshold
    })
    recipientLocationValue = recipientLocationValue.map(w=>w.string)
    this.recipientLocationValue = recipientLocationValue.join(' ')

    let recipientPersonField = wordObjects.filter(w=>{
        return w.key.includes(keys.recipient_person_field) && w.confidence>=w.threshold
    })
    recipientPersonField = recipientPersonField.map(w=>w.string)
    this.recipientPersonField = recipientPersonField.join(' ')

    let recipientPersonValue = wordObjects.filter(w=>{
        return w.key.includes(keys.recipient_person_value) && w.confidence>=w.threshold
    })
    recipientPersonValue = recipientPersonValue.map(w=>w.string)
    this.recipientPersonValue = recipientPersonValue.join(' ')

    let recipientPhoneField = wordObjects.filter(w=>{
        return w.key.includes(keys.recipient_phone_field) && w.confidence>=w.threshold
    })
    recipientPhoneField = recipientPhoneField.map(w=>w.string)
    this.recipientPhoneField = recipientPhoneField.join(' ')

    let recipientPhoneValue = wordObjects.filter(w=>{
        return w.key.includes(keys.recipient_phone_value) && w.confidence>=w.threshold
    })
    recipientPhoneValue = recipientPhoneValue.map(w=>w.string)
    this.recipientPhoneValue = recipientPhoneValue.join(' ')        
}

module.exports = Result