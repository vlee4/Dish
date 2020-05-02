import React from 'react'
import {connect} from 'react-redux'
import {MY_API_KEY} from '../../secrets'

export class Dish extends React.Component {
  //convert image to base64, then set on state as array, then map throught array on state to create new <img> tag
  constructor() {
    super()
    this.state = {
      selectImage: [],
      source: '',
      predictions: []
    }
    this.getUpload = this.getUpload.bind(this)
    this.getSource = this.getSource.bind(this)
    this.setPredictions = this.setPredictions.bind(this)
    this.doPredict = this.doPredict.bind(this)
    this.predictImage = this.predictImage.bind(this)
  }
  //Keeps track of the image being uploaded locally
  getUpload(img) {
    console.log('getting UPLOAD')
    if (this.state.selectImage.length) {
      //if there's already img on state
      let currentState = this.state.selectImage
      this.setState({selectImage: [...currentState, img]})
    } else {
      //if not image on state yet
      this.setState({selectImage: [img]})
    }
    // console.log('Is this the image?', img)
    // const imgDiv = document.getElementById('imagesDiv')
  }
  //use source to determine where photo came from (ie. url or upload)
  getSource(event) {
    console.log('SOURCE', event.target.value)
    this.setState({source: event.target.value})
  }
  //saves predictions for later use
  setPredictions(pdts) {
    this.setState({predictions: pdts})
  }
  //Actually does the prediction
  doPredict(Clarifai, app, thisDish, imageInput) {
    app.models
      .predict(Clarifai.FOOD_MODEL, imageInput)
      .then(function(resp) {
        thisDish.setPredictions(resp.outputs[0].data.concepts)
      })
      .then(function() {
        console.log('Here are my predictions', thisDish.state.predictions)
      })
      .catch(err =>
        console.log(
          "HOUSTON, WE'VE GOT A PROBLEM w/ the local IMAGE PREDICT",
          err
        )
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
      // this.getUpload(file)
      //Converting file to base64 string
      //Load is fired when a read has completed successfully
      reader.addEventListener(
        'load',
        function() {
          //the FileReader result = the file's contents, which is only valid after the read is complete
          var localBase64 = reader.result.split('base64,')[1]
          console.log('PREDICTING')
          //Identify image from image data: just console.logging right now
          thisDish.doPredict(Clarifai, app, thisDish, {base64: localBase64})
          thisDish.getUpload(localBase64)
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
      <div>
        <h2>This is the main app page</h2>
        <p>We are currently in construction</p>
        <form onSubmit={this.predictImage}>
          <div>
            <label htmlFor="filename">Upload an image</label>
            <button
              type="submit"
              name="filename"
              onClick={this.getSource}
              value="file"
            >
              Predict
            </button>
            {/* input could also be a captured image using the computer's cam, use input type=capture */}
            <input
              name="filename"
              type="file"
              id="filename"
              placeholder="Filename"
              accept="image/*"
              size="80"
              // onChange={this.getUpload}
            />
          </div>
          <div>
            <label htmlFor="imageUrl">Predict via image url</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="Image URL"
              size="80"
              onChange={this.getUpload}
            />
            <button
              type="submit"
              name="imageUrl"
              value="url"
              onClick={this.getSource}
            >
              Predict
            </button>
          </div>
          <div id="imagesDiv">
            {this.state.selectImage.length ? (
              this.state.selectImage.map((image, index) => {
                console.log('setting up image')
                return (
                  <div key={`id_${index}`}>
                    <img
                      className="uploadImg"
                      alt="Uploaded image"
                      src={`data:image/*;base64, ${image}`}
                    />
                  </div>
                )
              })
            ) : (
              <img className="uploadImg" src="/defaultDish.png" />
            )}
          </div>
        </form>
      </div>
    )
  }
}

export default connect()(Dish)

//REF: Clarifai Starter: https://github.com/Clarifai/javascript-starter
