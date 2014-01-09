mongoose.model('Booking', new Schema({
    personId:String,
    resourceId:String,
    from:Date,
    end:Date,
    to_be_cleaned:Boolean
}))
