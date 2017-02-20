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
### Project
### Screen

# Add dynamism to components
Up until now we had only stateless components, now we'll decide where the state should live.

## Identify minimal and complete representation of state
## Identify where the state should live
## Add inverse data flow

I like when a tool allows me to work efficiently, but I love when a tool allows me to think differently. React is a library that gives me both efficiency by having a long list of open source components, and a new way of thinking by having a functional approach to UI development.