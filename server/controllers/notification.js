import Task from "../models/Task.js";
import Users from "../models/User.js";
import { sendTaskEmail } from "../utility/sendOtp.js";
import cron from "node-cron";

const sendNotification = async() => {
    try {
        const allUsers = await Users.find(
            {},
            {
                _id: 1,
                email: 1,
                username: 1
            }
        );

        for (const user of allUsers) {
            if (!user.email) {
                console.log(
                    `Skipping ${user.username}: no email found`
                );
                continue;
            }

            const taskRecords = await Task.find(
                {
                    user: user._id,
                    cleared: false
                },
                {
                    task: 1,
                    _id: 0
                }
            );

            const emailResult = await sendTaskEmail(
                user.email,
                user.username,
                taskRecords
            );

            console.log(
                `Notification sent to ${user.email}`,
                emailResult?.id
            );
        }
    }
    catch (err) {
        console.error(
            "Notification sending failed:",
            err.message
        );
    }
};

const scheduleWeeklyNotifications = () => {
    // Every Saturday at 9:00 PM India time.
    const task = cron.schedule("0 21 * * 6", async () => {
    console.log("Running weekly task reminder job...");
    await sendNotification();
    }, {
        timezone: "Asia/Kolkata",
    });

    console.log("Weekly task reminder scheduled for Saturdays at 9:00 PM IST");
    return task;
};

export { scheduleWeeklyNotifications };
export default sendNotification;
