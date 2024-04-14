// Configuration options
const init_phones = ["KB50xx DFHRTF Target"],                // Optional. Which graphs to display on initial load. Note: Share URLs will override this set
      DIR = "data_fossy_hp/",                                // Directory where graph files are stored
      default_channels = ["L","R"],                 // Which channels to display. Avoid javascript errors if loading just one channel per phone
      default_normalization = "dB",                 // Sets default graph normalization mode. Accepts "dB" or "Hz"
      default_norm_db = 60,                         // Sets default dB normalization point
      default_norm_hz = 500,                        // Sets default Hz normalization point (500Hz is recommended by IEC)
      max_channel_imbalance = 5,                    // Channel imbalance threshold to show ! in the channel selector
      alt_layout = true,                           // Toggle between classic and alt layouts
      alt_sticky_graph = true,                      // If active graphs overflows the viewport, does the graph scroll with the page or stick to the viewport?
      alt_animated = true,                         // Determines if new graphs are drawn with a 1-second animation, or appear instantly
      alt_header = true,                           // Display a configurable header at the top of the alt layout
      alt_header_new_tab = true,                    // Clicking alt_header links opens in new tab
      alt_tutorial = true,                         // Display a configurable frequency response guide below the graph
      alt_augment = true,                          // Display augment card in phone list, e.g. review sore, shop link
      site_url = 'graph.html',                      // URL of your graph "homepage"
      share_url = true,                             // If true, enables shareable URLs
      watermark_text = "",                           // Optional. Watermark appears behind graphs
      watermark_image_url = "fossy-logo.svg",   // Optional. If image file is in same directory as config, can be just the filename
      page_title = "Fossy Graph",                     // Optional. Appended to the page title if share URLs are enabled
      page_description = "View and compare frequency response graphs for IEMs",
      accessories = true,                          // If true, displays specified HTML at the bottom of the page. Configure further below
      externalLinksBar = true,                      // If true, displays row of pill-shaped links at the bottom of the page. Configure further below
      expandable = false,                           // Enables button to expand iframe over the top of the parent page
      expandableOnly = false,                       // Prevents iframe interactions unless the user has expanded it. Accepts "true" or "false" OR a pixel value; if pixel value, that is used as the maximum width at which expandableOnly is used
      headerHeight = '0px',                         // Optional. If expandable=true, determines how much space to leave for the parent page header
      darkModeButton = true,                        // Adds a "Dark Mode" button the main toolbar to let users set preference
      targetDashed = true,                         // If true, makes target curves dashed lines
      targetColorCustom = false,                    // If false, targets appear as a random gray value. Can replace with a fixed color value to make all targets the specified color, e.g. "black"
      labelsPosition = "bottom-left",                   // Up to four labels will be grouped in a specified corner. Accepts "top-left," bottom-left," "bottom-right," and "default"
      stickyLabels = true,                          // "Sticky" labels 
      analyticsEnabled = false,                     // Enables Google Analytics 4 measurement of site usage
      extraEnabled = true,                          // Enable extra features
      extraUploadEnabled = true,                    // Enable upload function
      extraEQEnabled = true,                        // Enable parametic eq function
      extraEQBands = 10,                            // Default EQ bands available
      extraEQBandsMax = 20,                         // Max EQ bands available
      num_samples = 5,                              // Number of samples to average for smoothing
      scale_smoothing = 0.2;                        // Smoothing factor for scale transitions

// Specify which targets to display
const targets = [
    // { type: "Δ",                files:["Δ", "JM-1", "IEF Comp"] },
    // { type: "Tilt",             files:["Preference Tilt", "Neutral Tilt", "Pleasant Tilt", "Cosmic Brownie Tilt", "Kierke Tilt"]},
    // { type: "JM-1 Tilt",        files:["Charlie Marks Tilt", "Charlie Marks Bass Tilt", "Hadoe Tilt", "fesdonomist Based", "fesdonomist Based Rev.2"]},
    // { type: "Personal",         files:["Preference", "Neutral", "Pleasant"] },
    { type: "Neutral",          files:["KB50xx DFHRTF"] },
    // { type: "Community",        files:["Haruto 2024", "Haruto 2021", "Brownie", "Helene", "Xiao 2.0", "Runatera v4.2.3", "Mokou Bassmaxxing", "Mokou Beta 1", "Rennsport v3", "Razan Neutral V2.0", "DK8365"] },
    // { type: "Reviewer",         files:["IEF Neutral 2023", "IEF Neutral", "Antdroid", "HBB", "Banbeucmas", "Practiphile Balanced", "Practiphile Neutral", "Precogvision", "Super 22", "Timmy", "VSG"] },
    // { type: "Reviewer Tilt",    files:["HBB Tilt", "Timmy Tilt"] },
    // { type: "Harman",           files:["Harman IE 2016", "Harman IE 2017v1", "Harman IE 2017v2", "Harman IE 2019v2"] },
    // { type: "Preference",       files:["USound1V1", "USound1V1 Flat Bass", "Tork V5", "RTings", "Sonarworks", "VDSF"] }
];

// Haruto's Addons
const  preference_bounds_name = "Preference Bounds RAW",    // Preference bounds name
       preference_bounds_dir = "pref_bounds/",              // Preference bounds directory
       preference_bounds_startup = false,                   // If true, preference bounds are displayed on startup
       PHONE_BOOK = "phone_book_hp.json",                      // Path to phone book JSON file
       default_DF_name = "KB50xx DFHRTF",                               // Default RAW DF name
       dfBaseline = true,                                   // If true, DF is used as baseline when custom df tilt is on
       default_bass_shelf = 6,                              // Default Custom DF bass shelf value
       default_tilt = -1,                                   // Default Custom DF tilt value
       default_ear = 0,                                     // Default Custom DF ear gain value
       default_treble = 0,                                  // Default Custom DF treble gain value
       tiltableTargets = ["KB50xx DFHRTF"],                     // Targets that are allowed to be tilted
       compTargets = ["KB50xx DFHRTF"],                         // Targets that are allowed to be used for compensation
       allowCreatorSupport = false;                         // Allow the creator to have a button top right to support them

// *************************************************************
// Functions to support config options set above; probably don't need to change these
// *************************************************************

// But I will anyways haha - Haruto

// Set up the watermark, based on config options above
function watermark(svg) {
    let wm = svg.append("g")
        .attr("transform", "translate("+(pad.l+W/2)+","+(pad.t+H/2-20)+")")
        .attr("opacity",0.2);
    
    if ( watermark_image_url ) {
        wm.append("image")
            .attrs({x:-64, y:-64, width:128, height:128, "xlink:href":watermark_image_url});
    }
    
    if ( watermark_text ) {
        wm.append("text")
            .attrs({x:0, y:70, "font-size":28, "text-anchor":"middle", "class":"graph-name"})
            .text(watermark_text);
    }

    // svg.append("g")
    // .attr("opacity",0.2)
    // .append("text")
    // .attrs({x:765, y:314, "font-size":10, "text-anchor":"end", "class":"graph-name"})
    // .text("danque62.github.io/graph");
}



// Parse fr text data from REW or AudioTool format with whatever separator
function tsvParse(fr) {
    return fr.split(/[\r\n]/)
        .map(l => l.trim()).filter(l => l && l[0] !== '*')
        .map(l => l.split(/[\s,]+/).map(e => parseFloat(e)).slice(0, 2))
        .filter(t => !isNaN(t[0]) && !isNaN(t[1]));
}

// Apply stylesheet based layout options above
function setLayout() {
    function applyStylesheet(styleSheet) {
        var docHead = document.querySelector("head"),
            linkTag = document.createElement("link");
        
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("type", "text/css");
        
        linkTag.setAttribute("href", styleSheet);
        docHead.append(linkTag);
    }

    if ( !alt_layout ) {
        applyStylesheet("style.css");
    } else {
        applyStylesheet("style-alt.css");
        applyStylesheet("style-alt-theme.css");
    }
}
setLayout();

// Configure HTML accessories to appear at the bottom of the page. Displayed only if accessories (above) is true
// There are a few templates here for ease of use / examples, but these variables accept any HTML
const 
    // Short text, center-aligned, useful for a little side info, credits, links to measurement setup, etc. 
    simpleAbout = `
        <p class="center">
        This web software is based on the <a href="https://github.com/mlochbaum/CrinGraph"><b>CrinGraph</b></a> open source software project.
        <br>
        Measurements uploaded are made with a clone IEC 60318-4 coupler from <a href="http://www.aliexpress.com/item/4000789796521.html"><b>Sounds Good Store</b></a>
        <br>
        And the use of <a href="https://www.roomeqwizard.com/"><b>Room EQ Wizard</b></a> or <a href="https://apps.apple.com/us/app/audiotools-db-sound-audio/id325307477"><b>iOS AudioTools</b></a> as software of choice.
        <br>
        Resonance peak is either 8k peak fundamental or a 16k 1st harmonic. This is for cases where an IEM has a lot of  8k Hz that I can't even see the changes when inserting deeper or shallower. 16k is harder to hit as it's more delicate, but it's a fallback.
        </p>
    `,
    // Slightly different presentation to make more readable paragraphs. Useful for elaborated methodology, etc.
    paragraphs = `
        <h2>Viverra tellus in hac</h2>

        <p>Lorem ipsum dolor sit amet, <a href="">consectetur adipiscing elit</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quisque non tellus orci ac. Dictumst quisque sagittis purus sit amet volutpat consequat. Vitae nunc sed velit dignissim sodales ut. Faucibus ornare suspendisse sed nisi lacus sed viverra tellus in. Dignissim enim sit amet venenatis urna cursus eget nunc. Mi proin sed libero enim. Ut sem viverra aliquet eget sit amet. Integer enim neque volutpat ac tincidunt vitae. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Lacus luctus accumsan tortor posuere ac ut consequat semper. Non pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus. Aliquam sem et tortor consequat id. Cursus sit amet dictum sit amet justo donec. Donec adipiscing tristique risus nec feugiat in fermentum posuere.</p>

        <p>Diam donec adipiscing tristique risus nec. Amet nisl purus in mollis. Et malesuada fames ac turpis egestas maecenas pharetra. Ante metus dictum at tempor commodo ullamcorper a. Dui id ornare arcu odio ut sem nulla. Ut pharetra sit amet aliquam id diam maecenas. Scelerisque in dictum non consectetur a erat nam at. In ante metus dictum at tempor. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Euismod nisi porta lorem mollis aliquam ut porttitor leo a. Malesuada proin libero nunc consequat interdum. Turpis egestas sed tempus urna et pharetra pharetra massa massa. Quis blandit turpis cursus in hac habitasse. Amet commodo nulla facilisi nullam vehicula ipsum a.</p>

        <p>Mauris ultrices eros in cursus turpis massa tincidunt. Aliquam ut porttitor leo a diam sollicitudin. Curabitur vitae nunc sed velit. Cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Lectus nulla at volutpat diam ut. Nibh nisl condimentum id venenatis a condimentum vitae sapien. Tincidunt id aliquet risus feugiat in ante metus. Elementum nibh tellus molestie nunc non blandit massa enim. Ac tortor vitae purus faucibus ornare suspendisse. Pellentesque sit amet porttitor eget. Commodo quis imperdiet massa tincidunt. Nunc sed id semper risus in hendrerit gravida. Proin nibh nisl condimentum id venenatis a condimentum. Tortor at risus viverra adipiscing at in. Pharetra massa massa ultricies mi quis hendrerit dolor. Tempor id eu nisl nunc mi ipsum faucibus vitae.</p>

        <h2>Tellus orci</h2>

        <p>Viverra mauris in aliquam sem. Viverra tellus in hac habitasse platea. Facilisi nullam vehicula ipsum a arcu cursus. Nunc sed augue lacus viverra vitae congue eu. Pretium fusce id velit ut tortor pretium viverra suspendisse. Eu scelerisque felis imperdiet proin. Tincidunt arcu non sodales neque sodales ut etiam sit amet. Tellus at urna condimentum mattis pellentesque. Congue nisi vitae suscipit tellus. Ut morbi tincidunt augue interdum.</p>

        <p>Scelerisque in dictum non consectetur a. Elit pellentesque habitant morbi tristique senectus et. Nulla aliquet enim tortor at auctor urna nunc id. In ornare quam viverra orci. Auctor eu augue ut lectus arcu bibendum at varius vel. In cursus turpis massa tincidunt dui ut ornare lectus. Accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu. A diam sollicitudin tempor id. Tellus mauris a diam maecenas sed enim ut sem. Pellentesque id nibh tortor id aliquet lectus proin. Fermentum et sollicitudin ac orci phasellus. Dolor morbi non arcu risus quis. Bibendum enim facilisis gravida neque. Tellus in metus vulputate eu scelerisque felis. Integer malesuada nunc vel risus commodo. Lacus laoreet non curabitur gravida arcu.</p>
    `,
    // Customize the count of widget divs, and customize the contents of them. As long as they're wrapped in the widget div, they should auto-wrap and maintain margins between themselves
    widgets = `
        <div class="accessories-widgets">
            <div class="widget">
                <img width="200" src="cringraph-logo.svg"/>
            </div>

            <div class="widget">
                <img width="200" src="cringraph-logo.svg"/>
            </div>

            <div class="widget">
                <img width="200" src="cringraph-logo.svg"/>
            </div>
        </div>
    `,
    // Which of the above variables to actually insert into the page
    whichAccessoriesToUse = simpleAbout;

// Configure external links to appear at the bottom of the page. Displayed only if externalLinksBar (above) is true
const linkSets = [
    {
        label: "Other IEM databases",
        links: [
            {
                name: "In-Ear Fidelity",
                url: "https://crinacle.com/graphs/iems/graphtool/"
            },
            {
                name: "HarutoHiroki",
                url: "https://graphtool.harutohiroki.com/"
            },
            {
                name: "Listener's Graph Tool",
                url: "https://listener800.github.io/iems"
            },
            {
                name: "Brownie Graph Tool",
                url: "brownie.html"
            },
            {
                name: "Sibug Graph Tool",
                url: "sibug.html"
            },
            {
                name: "Audio Discourse",
                url: "https://iems.audiodiscourse.com/"
            },
            {
                name: "Banbeucmas",
                url: "https://banbeu.com/graph/tool/"
            },
            {
                name: "HypetheSonics",
                url: "https://www.hypethesonics.com/iemdbc/"
            },
        ]
    },
    {
        label: "Headphone databases",
        links: [
            {
                name: "Audio Discourse",
                url: "http://headphones.audiodiscourse.com/"
            },
            {
                name: "In-Ear Fidelity",
                url: "https://crinacle.com/graphs/headphones/graphtool/"
            },
            {
                name: "Listener's Graph Tool",
                url: "https://listener800.github.io/"
            }
        ]
    }
];



// Set up analytics
function setupGraphAnalytics() {
    if ( analyticsEnabled ) {
        const pageHead = document.querySelector("head"),
              graphAnalytics = document.createElement("script"),
              graphAnalyticsSrc = "graphAnalytics.js";
        
        graphAnalytics.setAttribute("src", graphAnalyticsSrc);
        pageHead.append(graphAnalytics);
    }
}
setupGraphAnalytics();



// If alt_header is enabled, these are the items added to the header
let headerLogoText = "",
    headerLogoImgUrl = "fossy-logo-long.svg",
    headerLinks = [
    {
        name: "Ranking List",
        url: "https://docs.google.com/spreadsheets/d/12gYzaCKeFOki6aWa3t8clZwyyqY3JLS0U--ROE0Uw-A/edit?usp=share_link"
    },
    {
        name: "Misc. Data",
        url: "https://docs.google.com/spreadsheets/d/1VgCy0LiGyIfdHTKx4jtNQoLFO3MiWNlnUcjGb45h4w8/edit?usp=share_link"
    },
    {
        name: "Squig.link",
        url: "https://therollo9.squig.link/"
    }
];


let tutorialDefinitions = [
    {
        name: 'Sub bass',
        width: '20.1%',
        description: 
        `The sense of rumble. Too little sub bass may cause loss of definition while too much would mean low-end clutter`
    },
    {
        name: 'Mid bass',
        width: '19.2%',
        description: 
        `The presence of bass in terms of its tactility. I usually just rely on the IEM's dynamics. Too much may cause muddiness, and too little may feel anemic`
    },
    {
        name: 'Lower midrange',
        width: '17.4%',
        description: 
        `Male vocals and low end of guitar. Too much of this can make vocals sound boxy. Can also be associated with muddiness`
    },
    {
        name: 'Upper midrange',
        width: "20%",
        description: 
        `Vocal placement and the guitar's attack and snap. Too much can have vocals sound very in-your-head and intimate, and may come off as shouty. 
        Some people prefer recession for the feeling of ethereal vocals, but I just usually find them as less forward.
        I have 3 targets that differ in this region to represent different levels of vocal forwardness that I can take.
        `
    },
    {
        name: 'Lower treble',
        width: '6%',
        description: 
        `Vocal edge and the guitar's grit. Too much can cause vocals and guitar to sound shrill and harsh. Too little may cause bluntness and maybe lifeless`
    },
    {
        name: 'Mid treble',
        width: '7.3%',
        description: 
        `Sibilance, and cymbal splashiness, although that can be affected by the IEM's timbre. Too much and it makes cymbals very harsh and maybe metallic sounding
        and too little can result in a dull and maybe plasticky sound`
    },
    {
        name: 'Air',
        width: '10%',
        description: 
        `Currently I perceive this more on how it feels like stuff has some reverb to them, like an extra trailing edge. It can also help with the perception of stage.
        I'll just say that if it is very uneven (not necessarily too much) then it adds an oversharpening filter in every component of music.
        In reality, you might not hear it, and also IEC711 couplers are not reliable 10k and above anyway.
        `
    }
]
