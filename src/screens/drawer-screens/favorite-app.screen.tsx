import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Images} from '../../constants';
import PdfModal from '../../modals/pdf.modal';
import FavoriteModal from '../../modals/favorite-app-detail.modal';
import WebView from 'react-native-webview';

const FavoriteAppScreen = ({route}) => {
  const {title, item} = route.params;
  const [openPdfModal, setOpenPdfModal] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const [titlePdf, setTitlePdf] = React.useState('');
  const [favoriteModalOpen, setFavoriteModalOpen] = React.useState(false);
  const [favoriteTitle, setFavoriteTitle] = React.useState('');
  const [selectedData, setSelectedData] = React.useState(null);

  const handlePdfModal = ({url, title}) => {
    setUrl(url);
    setTitlePdf(title);
    setOpenPdfModal(true);
  };

  const handleFavoriteModal = ({title, data}) => {
    setSelectedData(data);
    setFavoriteTitle(title);
    setFavoriteModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('tr-TR', {month: 'long'}).slice(0, 3);
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const content = item.contentPage.content.replace(
    /(src|href)="\/Uploads\//g,
    '$1="https://bizz.emlakkonut.com.tr/Uploads/',
  );
  console.log(content);

  const injectedCSS = `
  const style = document.createElement('style');
  style.innerHTML = \`
    body, p, a {
      font-size: 30 !important;
      font-weight: 600 !important;
      !important;
    }
    a {
      text-decoration: none;
    }
  \`;
  document.head.appendChild(style);
  true;
`;

  return (
    <View style={styles.container}>
      {item?.contentPage?.fileCategory ? (
        <FlatList
          data={item.contentPage.fileCategory.file}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          ListFooterComponent={() => (
            <WebView
              originWhitelist={['*']}
              injectedJavaScript={injectedCSS}
              source={{html: content}}
              style={{
                height: Dimensions.get('window').height * 1.5,
                backgroundColor: 'white',
                marginTop: 20,
                marginHorizontal: 20,
              }}
            />
          )}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.pdfTitle}>{item.name}</Text>
              <TouchableOpacity
                style={styles.pdfButton}
                onPress={() =>
                  handlePdfModal({
                    url: `https://bizz.emlakkonut.com.tr/images/uploads/original/${item.filePath}`,
                    title: item.name,
                  })
                }>
                <Image source={Images.PDF} style={styles.pdfIcon} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={item.contentPage.subContentPageList}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          ListFooterComponent={() => (
            <WebView
              originWhitelist={['*']}
              injectedJavaScript={injectedCSS}
              source={{html: content}}
              style={styles.webView}
            />
          )}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                handleFavoriteModal({title: item.title, data: item})
              }
              style={styles.card}>
              <Text style={styles.dateText}>
                {formatDate(item.modifiedDate)}
              </Text>
              <View style={styles.contentBlock}>
                <Text style={styles.subTitle}>{item.title}</Text>
                <Text style={styles.subDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <PdfModal
        visible={openPdfModal}
        setVisible={setOpenPdfModal}
        titlePdf={titlePdf}
        url={url}
      />
      <FavoriteModal
        visible={favoriteModalOpen}
        setVisible={setFavoriteModalOpen}
        title={favoriteTitle}
        selectedData={selectedData}
      />
    </View>
  );
};

export default FavoriteAppScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  flatList: {
    marginTop: 0,
    marginBottom: 0,
  },
  flatListContent: {
    paddingBottom: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: 'white',
    marginTop: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pdfTitle: {
    fontWeight: 'bold',
    color: Colors.BLACK,
    fontSize: 18,
    flex: 1,
  },
  pdfButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blueColor3,
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  pdfIcon: {
    width: 45,
    height: 35,
    resizeMode: 'contain',
  },
  dateText: {
    fontWeight: 'bold',
    color: Colors.orangeColor,
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  contentBlock: {
    flex: 4,
    marginLeft: 12,
  },
  subTitle: {
    fontWeight: 'bold',
    color: Colors.BLACK,
    fontSize: 18,
  },
  subDescription: {
    fontWeight: '300',
    color: Colors.BLACK,
    marginTop: 6,
    fontSize: 16,
  },
  webView: {
    height: Dimensions.get('window').height * 1.5,
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
  },
});
