# A workflow for component based frontend projects

The workflow I use for new frontend projects is based in part on [Pure UI](https://rauchg.com/2015/pure-ui) and [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html). Reading them gave me new ways to think about both the planning, estimation and implementation stages of a frontend development process. Pure UI explains how React's definition of views as pure functions of application state allows the programmer to estimate more accurately and to improve the programmer-designer communication. Thinking in React paints a clear picture about how to structure an app in components.

The process I follow to think about new React project is summarised in the following steps:

* Design components
* Define data
* Create static components
  * Break UI into component hierarchy
  * Build a static version
* Add dynamism to components
  * Identify minimal and complete representation of state
  * Identify where the state should live
  * Add inverse data flow

To exemplify this workflow I made a mini-mini-micro version of [Invision](https://www.invisionapp.com/) called Nightvision.

# Design components

The first thing I did was to determine the scope of the project. I decided to implement the minimum amount of functionality required to make something that kinda looks like Invision since this is just an attempt to show a methodology rather than trying to clone the original app. So these are nightvision's requirements.

* Welcome the user with a splash page
* Show a list of predefined screens that belong to a project
* When the user clicks a screen he should see that screen in view mode
* Once in view mode the user should be able to go to build mode. This mode lets him draw hotspots on the screen and link those hotspots with other screens.
* The user can navigate the project when he is in view mode by clicking the hotspots he generates

Once the scope is clear I started to design every page. The design process was easy because it was a reduction process, I created every screen by cloning Invision and removing everything I did not need. After removing a bunch of stuff that I did not want/need/had the time to implement, I came up with the following screens.

![Screens](file://nightvision.gif)

These screens will determine what components I need to create and the shape of the application's data.

# Define Data
After looking at the screens I come up with a data format that represents the app. This is just an initial guess, but its important to start with an educated guess instead of a shapeless blob of data.

```json
{
  "project": {
    "name": "ProjectName",
    "screens": [
      { "id": 1, "title": "Login", "filename": "login.jpg", "createdAt": "2017-02-20T09:18:18.429Z", "thumbnail": "/assets/login-thumb.jpg", "image": "/assets/login.jpg", "hotspots": [{ "x": 400, "y": 513, "width": 200, "height": 80, "linkTo": 2 }] },
      { "id": 2, "title": "Login Signup", "filename": "login-signup.jpg", "createdAt": "2017-02-20T09:18:18.429Z", "thumbnail": "/assets/login-thumb.jpg", "image": "/assets/login.jpg", "hotspots": [] }
    ]
  }
```

# Create static components
Static components aka stateless components aka pure components are the building blocks of react applications. They serve as reusable elements that combine piece by piece to become an app. In this step I decide which visual elements should become components, give them a name and place them in a component hierarchy.

## Break UI into component hierarchy
The first screen is a simple one, it is just a Splash page with a Logo inside.

![Screen one](link_to_that_image)

Splash
  Logo

The second screen has much more elements that can become components. The obvious one is the Project page which will contain the rest of the components. The other container components are Header and Body. Header contains a Logo and a Title, and Body has several ScreenThumbnails.

![Screen two](link_to_that_image)

Project
  Header
    Logo
    Title
  Body
    ScreenThumbnail

The third screen has a Screen component, which holds a ScreenImage and a Footer. ScreenImage only has a Hotspot component, while Footer has a Breadcrumb which will show the current routes and two Mode buttons.

![Screen three](link_to_that_image)

Screen
  ScreenImage
    Hotspot
  Footer
    Breadcrumb
      Logo
      Arrow
    ModeButtons
      ViewMode
      BuildMode

## Build a static version
With every component already identified, it is finally time to build them!

### Splash
Splash page is a full screen dark blue page with a centered logo.

#### Full screen
To make it cover the entire viewport I used css to set its width to 100vw (viewport width units) and height to 100vh (viewport height units).

#### Dark blue background
Since we are using [styled jsx](https://github.com/zeit/styled-jsx) as our component based CSS solution, we can easily store our app's colors in a js file and interpolate those values onto our component. This means we can have our colors neatly organized and will never have to copy paste a color hex number again.

```css
  .Splash {
    background-color: ${colors.darkBlue};
  }
```

### Logo

To create the Logo I used the logo I created in the design step, exported it to svg, optimized it with [SVG Optimizer](http://petercollingridge.appspot.com/svg-optimiser) and then used its markup in a React component. Now I can easily parameterize the logo using JSX!

```js
import React from 'react';
import classNames from 'classnames';

export default ({ color = '#898F9A', className }) =>
  <svg className={classNames('Logo', className)} viewBox="0 0 145 127">
    <g fill="none">
      <g fill={color}>
        <path d="M124 27.2C131.3 27.2 137.4 21.5 137.4 14.1 137.4 6.6 131.3 0.9 124 0.9 116.8 0.9 110.7 6.6 110.7 14.1 110.7 21.5 116.8 27.2 124 27.2M95.2 107.4C95.2 119 101.5 126.7 114.8 126.7 125.9 126.7 134.9 120.1 141.3 109.5L144.8 95.4C137.2 112.2 123.2 112.5 121.5 112.1 118.6 111.5 116.8 110.4 116.8 106.7 116.8 104.5 117.2 101.4 118.2 97.7L132.9 39.3 95.6 39.3 90.9 56.7 106.4 56.7 96.4 97.6C95.6 100.9 95.2 104.5 95.2 107.4Z" />
        <path d="M0.1 125.3L22.1 125.3 34.6 75C37.7 62.2 43.8 55.6 53 55.6 60.3 55.6 64.8 60.1 64.8 67.6 64.8 69.8 64.6 72.1 63.8 74.7L57.4 97.8C56.4 101.1 56 104.5 56 107.6 56 118.6 62.4 126.6 76 126.6 87.5 126.6 96.8 119.2 101.9 101.3L98.3 100.1C94 112.1 85.2 112.1 82.3 112.1 79.3 112.1 77.7 110.1 77.7 106.2 77.7 104.5 78.1 102.5 78.7 100.1L85 77.6C86.6 72.3 87.2 67.6 87.2 63.3 87.2 46.4 77 37.6 64.6 37.6 53 37.6 41.3 48.1 35.4 59.1L39.7 39.3 6.2 39.3 1.5 56.7 17.2 56.7 7.5 95.4 0.1 125.3Z" />
      </g>
    </g>
  </svg>;
```

[Here](https://nightvision-kokplpifzt.now.sh/) is a live version of this step, and [here](https://nightvision-kokplpifzt.now.sh/_src) is the corresponding source code.

### Project
### Screen

# Add dynamism to components
Up until now we had only stateless components, now we'll decide where the state should live.

## Identify minimal and complete representation of state
## Identify where the state should live
## Add inverse data flow

I like when a tool allows me to work efficiently, but I love when a tool allows me to think differently. React is a library that gives me both efficiency by having a long list of open source components, and a new way of thinking by having a functional approach to UI development.