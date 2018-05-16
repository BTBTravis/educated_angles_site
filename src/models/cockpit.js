export default (services) => {
  //helpers
  let fullPathImages = res => {
    let imgKeys = [];
    for(var key in res.data.fields) if(res.data.fields[key].type === 'image') imgKeys.push(key);
    res.data.entries = res.data.entries.map(entry => {
      imgKeys.map(key => {
        if(entry.hasOwnProperty(key)) entry[key].path = process.env.COCKPIT_IMG_PATH + entry[key].path;
      });
      return entry;
    });
    return res;
  }

  let getHomePageSections = () => services.axios(process.env.COCKPIT_PATH + 'collections/get/home_page_sections?token=' + process.env.COCKPIT_TOKEN)
    .then(res => {
      return fullPathImages(res);
    })
    .then(function (cmsData) {
      //cmsData = fullPathImages(cmsData);
      let staticTitles = [
        ['upcoming_events', 'Upcoming Events'],
        ['volunteer_opportunities', 'Volunteer Opportunities']
      ];
      let titles = cmsData.data.entries.map((entry, i) => ["section_" + i, entry.title]);
      let finalTitles = staticTitles.concat(titles);
      return { sections: cmsData.data.entries, titles: finalTitles  };
    })
    //.catch(e => {
      //// TODO: Alert
      //return {
        //sections: [],
        //titles: []
      //};
    //});

  let getHomePageCards = () => services.axios.get(process.env.COCKPIT_PATH + 'collections/get/home_page_cards?token=' + process.env.COCKPIT_TOKEN)
    .then(res => {
      return fullPathImages(res);
    })
    .then(function (cmsData) {
      return cmsData.data.entries;
    })
    //.catch(e => {
      //// TODO: Alert
      //return [];
    //});

  let getEvents = () => services.axios.get(process.env.COCKPIT_PATH + 'collections/get/events?token=' + process.env.COCKPIT_TOKEN)
    .then(function (cmsData) {
      return cmsData.data.entries;
    })
    .then(events => {
      return events.map(evt => {
        evt.month = services.moment(evt.date).format('MMM');
        evt.day = services.moment(evt.date).format('D');
        return evt;
      });
    });
    //.catch(e => {
      //// TODO: Alert
      //return [];
    //});

  return {
    getHomePageSections: getHomePageSections,
    getHomePageCards: getHomePageCards,
    getEvents: getEvents
  }
}

