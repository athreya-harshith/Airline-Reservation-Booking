function compareTimes(time1,time2)
{
    let t1 = new Date(time1);
    let t2 = new Date(time2);
    return t1.getTime() > t2.getTime();
}


module.exports= {compareTimes}