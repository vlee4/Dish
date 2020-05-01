import React from 'react'
import {connect} from 'react-redux'
import {MY_API_KEY} from '../../secrets'

export class Dish extends React.Component {
  constructor() {
    super()
    this.state = {
      selectImage: '',
      // predictions: []
      source: ''
    }
    this.predictImage = this.predictImage.bind(this)
    // this.isValidFile = this.isValidFile.bind(this)
    this.getUpload = this.getUpload.bind(this)
    this.getSource = this.getSource.bind(this)
  }

  getUpload(event) {
    this.setState({selectImage: event.target.value})
    console.log('Is this the image?', event.target.value)
  }
  //use source later to determine where photo came from (ie. url or upload)
  getSource(event) {
    console.log('SOURCE', event.target.value)
    this.setState({source: event.target.value})
  }

  // isValidFile() {
  //   console.log('What file was uploaded?', this.state.selectImage)
  //   let file = this.state.selectImage
  //   if (file.value == '') {
  //     console.log('Please upload a file first')
  //   } else {
  //     this.predictImage(file.value, 'file')
  //   }
  //   //will call predict Image if file is valid
  // }

  predictImage(event) {
    //REF: Clarifai Starter
    event.preventDefault()
    console.log('EVENT', event)
    // console.log('value', event.target.value)

    //Make Clarifai app instance
    const Clarifai = require('clarifai')

    const app = new Clarifai.App({
      apiKey: MY_API_KEY
    })

    if (this.state.source === 'file') {
      const file = document.getElementById('filename').files[0]
      var reader = new FileReader()
      // const file = document.getElementById('filename').value
      console.log('My file', file)

      //Supposedly converting file w/ some base64 stuffs
      //Load is fired when a read has completed successfully
      reader.addEventListener(
        'load',
        function() {
          var localBase64 = reader.result.split('base64,')[1] //the FileReader result = the file's contents, which is only valid after the read is complete
          console.log('PREDICTING')
          //Identify image from image data: just console.logging right now
          app.models
            .predict(Clarifai.FOOD_MODEL, {base64: localBase64})
            .then(resp => console.log('MY RESPONSE', resp))
            // .then((resp) => console.log(resp.outputs[0].data.concepts[0].name))
            .catch(err =>
              console.log(
                "HOUSTON, WE'VE GOT A PROBLEM w/ the local IMAGE PREDICT",
                err
              )
            )
        },
        false
      )
      if (file) {
        reader.readAsDataURL(file)
      }
    } else if (this.state.source === 'url') {
      console.log('URL button was clicked')
      const img = document.getElementById('imageUrl').value
      console.log('img', img)

      app.models
        .predict(Clarifai.FOOD_MODEL, {url: img})
        .then(resp => console.log('MY RESPONSE', resp))
        // .then((resp) => console.log(resp.outputs[0].data.concepts[0].name))
        .catch(err =>
          console.log('An ERROR HATH OCCURRED w/ the IMAGE URL PREDICT', err)
        )
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
              // value={this.state.selectImage}
              onChange={this.getUpload}
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
        </form>
      </div>
    )
  }
}

export default connect()(Dish)

//REF: Clarifai Starter: https://github.com/Clarifai/javascript-starter
