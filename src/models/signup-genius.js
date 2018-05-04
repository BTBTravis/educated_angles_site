export default (services) => {
  let getEvents = () => services.axios.get('https://api.signupgenius.com/v2/k/signups/created/active/?user_key=' + services.env.key)
    .then(function (response) {
      return response.data.data.map(function (evt) {
        evt.event_type = 'signupgenius';
        evt.month = services.moment(evt.starttime).format('MMM');
        evt.day = services.moment(evt.starttime).format('D');
        return evt;
      });
    });

  return {
    getEvents: getEvents
  }
}
