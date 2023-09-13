var cron = require('node-cron');
const {BookingService} = require('../../services');
function scheduleCrons()
{
    cron.schedule('*/10 * * * *',async () => {
        console.log('running a task every minute');
        await BookingService.cancelOldBookings();
        // console.log(response);
      });
}
module.exports = scheduleCrons;