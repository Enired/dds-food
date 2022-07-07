# Option 10: Food Pick-up Ordering

A food ordering experience for a single restaurant.

- Hungry clients of this fictitious restaurant can <font color="red">visit its website</font>, <font color="green">select one or more dishes</font> and <font color="yellow">place an order for pick-up.</font>

- They will <font color="grayblue">receive a notification when their order is ready.</font>
- The restaurant and client both need to be notified since this app serves as an intermediary.

- When an order is placed the <font color="goldenrod">restaurant receives the order via SMS</font>.

- The restaurant can then <font color="seafoam">specify how long it will take to fulfill it.</font>

- Once they provide this information, the <font color="pink">website updates for the client and also notifies them via SMS.</font>

##### You can use a modern telecomm API service such as Twilio to implement SMS communication from the website to the client and restaurant.

##### For inspiration check out how Ritual works, but keep in mind that's implemented as a native app and serves more than one restaurant.

<br>

# Minimum Viable Product

## User Experience
1. <font color="red">Visits the website</font> <b>FE</b>
1. <font color="green">Selects the dishes</font> <b>FE</b>
1. <font color="yellow">Places the order for pick-up</font> <b>FE -> BE</b>
1. <font color="pink">Receives update on how long the order will take (on website and through SMS)</font> <b>BE -> FE</b>
1. <font color="grayblue">Receives update that order is ready for pick-up (on website and through SMS)</font> <b> BE -> FE</b>

## Restaurant Experience
1. <font color="goldenrod">Receives an order via SMS</font> <b>BE</b>
1. <font color="seafoam">Specifies how long an order will take</font> <b>BE</b>

## Where We Come In
1. Update website that order is placed (<font color="yellow">from User</font>) <b>FE</b>
1. Receive new order from user (<font color="yellow">from User</font>) <b>BE</b>
1. Add the new order to orders table in database (<font color="yellow">from User</font>) <b>BE</b>
1. Send restaurant SMS with order details (<font color="goldenrod">to Restaurant</font>) <b>BE</b>
1. Receive time-to-fulfill from restaurant (<font color="seafoam">from Restaurant</font>) <b>BE</b>
1. Store time-to-fulfill in orders table in database (<font color="seafoam">from Restaurant</font>) <b>BE</b>
1. Send user SMS to inform time-to-fulfill (<font color="pink">to User</font>) <b>BE</b>
1. Update website with time-to-fulfill (<font color="pink">to User</font>) <b>BE -> FE</b>
1. Countdown from time-to-fulfill to zero ?? Or wait for restaurant to say when ready <b>BE</b>
1. Send user SMS to inform that order is ready (<font color="grayblue">to User</font>) <b>BE</b>
1. Update website to tell user that order is ready (<font color="grayblue">to User</font>) <b>BE -> FE</b>

