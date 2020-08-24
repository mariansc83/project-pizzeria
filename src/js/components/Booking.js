import { templates } from "../settings";

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(widgetContainer);
    thisBooking.initWidgets();
  }

  render() {
    const thisBooking = this;

    const generateHTML = templates.bookingWidget();
    thisBooking.dom = {};
  }
}

export default Booking;
