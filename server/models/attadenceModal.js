const attendanceSchema = new mongoose.Schema(
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      },
  
      date: Date,
  
      status: {
        type: String,
        enum: ["PRESENT", "ABSENT"],
        default: "PRESENT"
      },
  
      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HR"
      }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Attendance", attendanceSchema);
  