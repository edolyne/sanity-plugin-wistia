import PropTypes from 'prop-types'
import React from 'react'
import config from 'config:@sanity/wistia'
import FormField from 'part:@sanity/components/formfields/default'
import SearchableSelect from 'part:@sanity/components/selects/searchable'
import PatchEvent, {set, unset} from '@sanity/form-builder/PatchEvent'
import ReactPlayer from 'react-player'
import styles from './input.css'
import axios from 'axios'

const SearchItem = item => <div>{item.title}</div>

export default class Wistia extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string
    }).isRequired,
    level: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      videos: []
    }
  }

  focus() {
    this._inputElement.focus()
  }

  handleChange = value => {
    console.log(value)
    const patch = value === '' ? unset() : set(value)
    this.props.onChange(PatchEvent.from(patch))
  }

  handleClear = () => {
    this.props.onChange(PatchEvent.from(unset()))
  }

  componentWillMount = () => {
    new Promise((resolve, reject) => {
      this.getWistiaVideos(1, [], resolve, reject)
    })
      .then(response => {
        this.setState({ videos: response })
      })
  }

  getWistiaVideos = (page, returnedVideos, resolve, reject) => {
    axios(`https://api.wistia.com/v1/medias.json?api_password=${config.apiPassword}&page=${page}`)
      .then(response => {
        const retrivedVideos = returnedVideos.concat(response.data)

        if (response.data.length === 100) {
          this.getWistiaVideos(page + 1, retrivedVideos, resolve, reject)
        } else {
          let videoReturn = []

          retrivedVideos.map((item) => {
            videoReturn.push({ title: item.name, id: item.hashed_id })
          })

          resolve(videoReturn)
        }
      })
      .catch(error => {
        console.log(error)
        reject('Something wrong. Please refresh the page and try again.')
      })
  }

  getMatchingResults = (query, titleArray) => {
    return titleArray
      .filter(queryItem => queryItem.title.toLowerCase().includes(query.toLowerCase()))
      .map(queryItem => (queryItem))
  }

  handleSearch = query => {
    this.setState({results: this.getMatchingResults(query, this.state.videos)})
  }

  render() {
    const {type, value, level} = this.props
    const title = `${type.title}`
    return (
      <div>
        <FormField label={title} level={level} description={type.description}>
          <SearchableSelect
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            onClear={this.handleClear}
            value={value}
            inputValue={value ? value.title : ''}
            items={this.state.results || this.state.videos}
            renderItem={SearchItem}
          />
        </FormField>
        {(value && value.id) &&
          <div
            className={styles.previewWrapper}
          >
            <div
              className={styles.playerWrapper}
            >
              <ReactPlayer
                url={`https://${config.wistiaUrl}.wistia.com/medias/${value.id}`}
                className={styles.reactPlayer}
                width="100%"
                height="100%"
                config={{
                  wistia: {
                    options: {
                      videoFoam: true
                    }
                  }
                }}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}
