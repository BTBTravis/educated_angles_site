export default (services) => {
  //helpers
  let fullPathImages = res => {
    let imgKeys = [];
    for(var key in res.data.fields) if(res.data.fields[key].type === 'image') imgKeys.push(key);
    res.data.entries = res.data.entries.map(entry => {
      imgKeys.map(key => {
        if(entry.hasOwnProperty(key)) entry[key].path = (services.env.cockpitPath.substring(0, services.env.cockpitPath.length - 5)) + entry[key].path;
      });
      return entry;
    });
    return res;
  }

  let getHomePageSections = () => services.axios(services.env.cockpitPath + 'collections/get/home_page_sections?token=' + services.env.cockpitToken)
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

  let getHomePageCards = () => services.axios.get(services.env.cockpitPath + 'collections/get/home_page_cards?token=' + services.env.cockpitToken)
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

  let getEvents = () => services.axios.get(services.env.cockpitPath + 'collections/get/events?token=' + services.env.cockpitToken)
    .then(function (cmsData) {
      return cmsData.data.entries;
    })
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

