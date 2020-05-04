import React from 'react'
import {connect} from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Made with <3 '}
      <Link color="inherit" href="https://material-ui.com/" />{' '}
      {'May 2020' /* {new Date().getFullYear()} */}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    textAlign: 'center'
  }
}))

const Footer = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="h6">
            Created Using:
            <div id="Resources">
              <div id="edamam-badge" data-color="transparent" />
              <a href="https://www.clarifai.com/">
                <img
                  id="Clarifai"
                  src="https://www.clarifai.com/hubfs/Logos/Clarifai/Clarifai_web_Logo-1.png"
                />
              </a>
            </div>
          </Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  )
}

export default connect()(Footer)
