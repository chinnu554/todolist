import Task from "../models/Task.js";
import NotifyUser from "../models/Notification.js";
import Users from "../models/User.js";
import { sendTaskEmail } from "../utility/sendOtp.js";
import cron from "node-cron";

const getDateKey = (date = new Date()) =>
    new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);

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

            const dateKey = getDateKey();

            try {
                await NotifyUser.create({
                    email: user.email,
                    notifiedDate: new Date(),
                    dateKey,
                });

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
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`Notification already sent to ${user.email} for ${dateKey}`);
                    continue;
                }

                await NotifyUser.deleteOne({ email: user.email, dateKey });
                console.error(`Notification failed for ${user.email}:`, err.message);
            }
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
