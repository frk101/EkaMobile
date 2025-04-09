/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Enums, Images} from '../../constants';
import PdfModal from '../../modals/pdf.modal';
import FavoriteModal from '../../modals/favorite-app-detail.modal';
import WebView from 'react-native-webview';

const FavoriteAppScren = ({route}) => {
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
    // setFavoriteUrl(url);
    setFavoriteTitle(title);
    setFavoriteModalOpen(true);
    //     setUrl(url);
    //     setTitlePdf(title);
    // setOpenPdfModal(true);
  };
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('tr-TR', {month: 'long'}).slice(0, 3); // Ayın ilk 3 harfi
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };
  const content = item.contentPage.content.replace(
    /(src|href)="\/Uploads\//g,
    '$1="https://bizz.emlakkonut.com.tr/Uploads/',
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {item?.contentPage?.fileCategory ? (
        <FlatList
          style={{marginTop: 0, marginBottom: 0}}
          contentContainerStyle={{paddingBottom: 0}}
          ListFooterComponent={() => (
            <WebView
              originWhitelist={['*']}
              source={{html: content}}
              style={{
                height: Dimensions.get('window').height,
                backgroundColor: 'white',
                margin: 0,
                padding: 0,
                marginTop: 20,
                marginHorizontal: 20,
              }}
            />
          )}
          data={item.contentPage.fileCategory.file}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor: 'white',
                marginTop: 10,
              }}>
              <Text style={{fontWeight: 'bold', color: Colors.BLACK}}>
                {item.name}
              </Text>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.blueColor3,
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                }}
                onPress={() =>
                  handlePdfModal({
                    url: `https://bizz.emlakkonut.com.tr/images/uploads/original/${item.filePath}`,
                    title: item.name,
                  })
                }>
                <Image
                  source={Images.PDF}
                  style={{width: 40, height: 30, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          style={{marginTop: 0, marginBottom: 0}}
          contentContainerStyle={{paddingBottom: 0}}
          data={item.contentPage.subContentPageList}
          ListFooterComponent={() => (
            <WebView
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowUniversalAccessFromFileURLs={true}
              originWhitelist={['*']}
              source={{html: content}}
              style={{
                height: Dimensions.get('window').height,
                backgroundColor: 'white',
                margin: 0,
                padding: 0,
                marginTop: 20,
                marginHorizontal: 20,
              }}
            />
          )}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                handleFavoriteModal({title: item.title, data: item})
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                marginHorizontal: 20,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor: 'white',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: Colors.orangeColor,
                  flex: 1,
                  textAlign: 'center',
                }}>
                {formatDate(item.modifiedDate)}
              </Text>
              <View style={{flex: 4, marginLeft: 10}}>
                <Text style={{fontWeight: 'bold', color: Colors.BLACK}}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontWeight: '200',
                    color: Colors.BLACK,
                    marginTop: 5,
                  }}>
                  {item.description}
                </Text>
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

export default FavoriteAppScren;

const styles = StyleSheet.create({});
