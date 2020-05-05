import React from 'react'
import {connect} from 'react-redux'
import {MY_API_KEY} from '../../secrets'
import Recipes from './Recipes'

export class Dish extends React.Component {
  constructor() {
    super()
    this.state = {
      selectImage: [],
      source: ''
    }
    this.getUpload = this.getUpload.bind(this)
    this.getSource = this.getSource.bind(this)
    this.doPredict = this.doPredict.bind(this)
    this.predictImage = this.predictImage.bind(this)
  }
  //Keeps track of the image being uploaded locally
  getUpload(imgData) {
    console.log('getting UPLOAD')
    if (this.state.selectImage.length) {
      //if there's already imgData on state
      let currentState = this.state.selectImage
      this.setState({selectImage: [...currentState, imgData]})
    } else {
      //if not image on state yet
      this.setState({selectImage: [imgData]})
    }
  }
  //use source to determine where photo came from (ie. url or upload)
  getSource(event) {
    console.log('SOURCE', event.target.value)
    this.setState({source: event.target.value})
  }

  //Actually does the prediction
  doPredict(Clarifai, app, thisDish, imageInput, src) {
    app.models
      .predict(Clarifai.FOOD_MODEL, imageInput, {minValue: 0.5})
      .then(function(resp) {
        src === 'file'
          ? thisDish.getUpload({
              src: 'file',
              Image: imageInput.base64,
              predictions: resp.outputs[0].data.concepts
            })
          : thisDish.getUpload({
              src: 'url',
              Image: imageInput.url,
              predictions: resp.outputs[0].data.concepts
            })
      })
      .then(function() {
        console.log('Got pass setting Predictions & getUpload')
      })
      .catch(err =>
        console.log("HOUSTON, WE'VE GOT A PROBLEM w/ the IMAGE PREDICT", err)
      )
  }
  //Runs once predict is clicked
  predictImage(event) {
    //REF: Clarifai Starter
    event.preventDefault()
    console.log('EVENT', event)

    //Make Clarifai app instance
    const Clarifai = require('clarifai')

    const app = new Clarifai.App({
      apiKey: MY_API_KEY
    })

    //IF THE FILE IS FROM LOCAL MACHINE
    if (this.state.source === 'file') {
      const file = document.getElementById('filename').files[0]
      var reader = new FileReader()
      const thisDish = this

      //Converting file to base64 string
      //Load is fired when a read has completed successfully
      reader.addEventListener(
        'load',
        function() {
          //the FileReader result = the file's contents, which is only valid after the read is complete
          var localBase64 = reader.result.split('base64,')[1]
          console.log('PREDICTING')
          //Identify image from image data
          thisDish.doPredict(
            Clarifai,
            app,
            thisDish,
            {base64: localBase64},
            'file'
          )
        },
        false
      )
      if (file) {
        reader.readAsDataURL(file)
      }
    } else if (this.state.source === 'url') {
      //IF THE IMAGE FROM ONLINE
      console.log('URL button was clicked')
      const img = document.getElementById('imageUrl').value
      console.log('img', img)

      this.doPredict(Clarifai, app, this, {url: img})
    }
  }

  render() {
    return (
      <div id="mainApp">
        <h2>Welcome to Something Yummy</h2>
        <p id="description">
          Do you ever have so much food in your pantry, yet nothing to eat at
          the same time? Or you just want to try something new? Let us help you
          create on a delicious meal. Simply, choose a picture of a food you
          have a taste for and an idea from the populated drop down and we'll
          find a number of recipes for you.
        </p>
        <form onSubmit={this.predictImage} className="inputImgForm">
          <div>
            <label htmlFor="filename">Upload an image</label>
            <button
              type="submit"
              name="filename"
              onClick={this.getSource}
              value="file"
            >
              Click me
            </button>
            {/*Future: input could also be a captured image using the computer's cam, use input type=capture */}
            <input
              name="filename"
              type="file"
              id="filename"
              placeholder="Filename"
              accept="image/*"
              size="80"
            />
          </div>
          <div>
            <label htmlFor="imageUrl">Add an image url</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="Image URL"
              size="80"
            />
            <button
              type="submit"
              name="imageUrl"
              value="url"
              onClick={this.getSource}
            >
              Click me
            </button>
          </div>
        </form>
        <br />
        <hr />
        <div className="imagesDiv">
          {this.state.selectImage.length ? (
            this.state.selectImage.map((image, index) => {
              console.log('setting up image')
              if (image.src === 'url') {
                return (
                  <div key={`id_${index}`}>
                    <div id="imgPred">
                      <img
                        className="uploadImg"
                        alt="image from url"
                        src={image.Image}
                      />
                      <div className="imgPredictions">
                        <h4>Entry #{index + 1} Associations</h4>
                        <div>
                          {image.predictions.map(pdt => {
                            return (
                              <div key={pdt.id}>
                                <div>
                                  {pdt.name}: {pdt.value}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Recipes
                        entry={index + 1}
                        predictions={image.predictions}
                      />
                    </div>
                    <br />
                    <hr />
                  </div>
                )
              }

              return (
                <div key={`id_${index}`}>
                  <div id="imgPred">
                    <img
                      className="uploadImg"
                      alt="Uploaded image"
                      src={`data:image/*;base64, ${image.Image}`}
                    />
                    <div className="imgPredictions">
                      <h4>Entry #{index + 1} Associations</h4>
                      <div>
                        {image.predictions.map(pdt => {
                          return (
                            <div key={pdt.id}>
                              <div>
                                {pdt.name}: {pdt.value}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Recipes
                      entry={index + 1}
                      predictions={image.predictions}
                    />
                  </div>
                  <br />
                  <hr />
                </div>
              )
            })
          ) : (
            <img id="dish" src="/defaultDish.png" />
          )}
        </div>
      </div>
    )
  }
}

export default connect()(Dish)

//REF: Clarifai Starter: https://github.com/Clarifai/javascript-starter
