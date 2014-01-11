Booking=mongoose.model('Booking', new Schema({
    email:String,
    resourceId:String,
    from:Date,
    to:Date,
    to_be_cleaned:Boolean
}))
