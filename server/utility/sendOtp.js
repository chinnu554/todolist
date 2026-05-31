import resend from "../configs/resend.js";

async function sendOtp(email,otp){
     const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Todo App <onboarding@resend.dev>",
        to: email,
        subject: "Your TodoList Verification Code",
        html: `
        <h2>Email Verification</h2>
        <p>Hello this is from todo list built by Eswar Mavalluru</p>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
        `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send OTP email");
  }

  return data;
}

const sendTaskEmail = async (
  email,
  username,
  tasks
) => {
  const from = process.env.RESEND_FROM_EMAIL;
  if(tasks.length > 0){

   const taskList = tasks
    .map((task) => `<li>${task.task}</li>`)
    .join("");

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: "Weekly Task Reminder",
    html: `
      <h2>Hello ${username},</h2>

      <p>You still have the following tasks pending:</p>

      <ul>
        ${taskList}
      </ul>

      <p>Finish them and start next week strong 🚀</p>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send task reminder email");
  }

  return data;
  }
  else{
     const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: "Weekly Task Reminder",
    html: `
      <h2>Hello ${username},</h2>
      <h3>Congratulations</h3>
      <p>
      You completed all your tasks this week.
      Enjoy your weekend.
      </p>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send task reminder email");
  }

  return data;
  }
 
};

export default sendOtp;
export {sendOtp,sendTaskEmail};
