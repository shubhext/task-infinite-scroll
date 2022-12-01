import * as React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
interface AppProps {}

interface AppState {
  page: number;
  totoalPageSize: number;
  hitsApi: {title: string; author: string; url: string}[];
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      page: 0,
      hitsApi: [],
      totoalPageSize: 0,
    };
  }

  handleFetch = async () => {
    const res = await axios.get(
      `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${this.state.page}`,
    );
    console.log('====================================');
    console.log({res});
    console.log('====================================');

    this.setState({
      page: this.state.page + 1,
      totoalPageSize: res.data.nbPages,
      hitsApi: [...this.state.hitsApi, ...res.data.hits],
    });
  };

  timer: any;
  componentDidMount() {
    this.handleFetch();
    this.timer = setInterval(() => {
      this.state.page < this.state.totoalPageSize && this.handleFetch();
    }, 5000);
  }
  componentWillUnmount(): void {
    clearInterval(this.timer);
  }
  render() {
    console.log({...this.state});

    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.viewmain}>
            {this.state.hitsApi.map((hits, i) => {
              return (
                <View style={styles.card} key={hits.title + i}>
                  <View>
                    <Text style={styles.text1}>{hits.title}</Text>
                    <Text style={styles.text2}>{hits.author}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  viewmain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 10,
  },
  card: {
    width: '30%',
    marginRight: '1%',
    marginBottom: '2%',
    marginLeft: '1%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderWidth: 1,
    borderRadius: 10,
    height: 150,
    padding: 10,
  },
  text1: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  text2: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
});

export default App;
