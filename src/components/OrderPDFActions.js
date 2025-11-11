import React from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy'; // ⚙️ Dùng API legacy để tránh warning
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL_IMG } from '../data/url';

const OrderPDFActions = ({
  pdfUrl,
  showOpen = true,
  showDownload = false,
  showShare = true,
  showPrint = true,
  showCopy = true,
}) => {
  const [loading, setLoading] = React.useState(false);
  const urlPdf = BASE_URL_IMG + '/' + pdfUrl;

  // 🟩 Mở PDF trên trình duyệt
  const openPDF = async () => {
    try {
      await Linking.openURL(urlPdf);
    } catch (error) {
      Alert.alert('❌ Lỗi', 'Không thể mở PDF.');
    }
  };

  // 🟨 Tải PDF xuống sandbox
  const downloadPDF = async () => {
    try {
      setLoading(true);
      const fileName = pdfUrl.split('/').pop() || 'order.pdf';

      // 🧠 iOS: mở Safari để người dùng lưu bằng "Lưu vào Tệp"
      if (Platform.OS === 'ios') {
        await Linking.openURL(pdfUrl);
        Alert.alert(
          '📄 Mở Safari',
          'Vui lòng chọn “Chia sẻ” → “Lưu vào Tệp” để lưu PDF trên iPhone.',
        );
        return;
      }

      // ✅ Android: tải về và chia sẻ
      const fileUri = FileSystem.documentDirectory + fileName;
      const { uri } = await FileSystem.downloadAsync(pdfUrl, fileUri);
      console.log('✅ File PDF đã lưu tại:', uri);

      // Mở menu chia sẻ
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }

      Alert.alert('✅ Tải thành công', 'File PDF đã được tải về và sẵn sàng chia sẻ.');
    } catch (error) {
      console.log('❌ Download PDF thất bại:', error);
      Alert.alert('❌ Lỗi', 'Không thể tải PDF.');
    } finally {
      setLoading(false);
    }
  };

  // 🟦 Chia sẻ PDF
  const sharePDF = async () => {
    try {
      setLoading(true);
      const fileName = urlPdf.split('/').pop() || 'order.pdf';
      const fileUri = FileSystem.documentDirectory + fileName;

      // console.log('🔹 Bắt đầu tải:', urlPdf);

      // Xóa file cũ (nếu có)
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      }

      // 🧠 Dùng fetch để chắc chắn lấy đúng PDF binary
      const response = await fetch(urlPdf);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType?.includes('pdf')) {
        throw new Error('Không phải file PDF hợp lệ');
      }

      const blob = await response.blob();
      const reader = new FileReader();

      const base64Data = await new Promise((resolve, reject) => {
        reader.onerror = () => reject('❌ Lỗi đọc blob');
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });

      // 📝 Lưu file vào bộ nhớ app
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      //console.log('✅ File PDF đã lưu:', fileUri);

      // 🟢 Chia sẻ
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Chia sẻ PDF',
        });
      } else {
        Alert.alert('⚠️ Thiết bị không hỗ trợ chia sẻ file.');
      }
    } catch (error) {
      console.log('❌ Lỗi chia sẻ PDF:', error);
      Alert.alert('❌ Lỗi', 'Không thể chia sẻ file PDF.');
    } finally {
      setLoading(false);
    }
  };

  // 🟥 In PDF
  const printPDF = async () => {
    try {
      await Print.printAsync({ uri: urlPdf });
    } catch (error) {
      // Alert.alert('❌ Lỗi', 'Không thể in PDF.');
    }
  };

  // 📋 Sao chép link
  const copyLink = async () => {
    try {
      //console.log(BASE_URL_IMG + '/' + pdfUrl);
      await Clipboard.setStringAsync(urlPdf);
      Alert.alert('✅ Đã sao chép', 'Link tải về đã được sao chép vào clipboard.');
    } catch (error) {
      Alert.alert('❌ Lỗi', 'Không thể sao chép link.');
    }
  };

  // 🔧 Style chung cho các nút
  const buttonStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  };

  return (
    <View
      style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, justifyContent: 'center' }}
    >
      {loading && <ActivityIndicator size="small" color="#007AFF" />}

      {showOpen && (
        <TouchableOpacity onPress={openPDF} style={buttonStyle}>
          <Ionicons name="link-outline" size={18} color="#007AFF" />
          <Text style={{ color: '#007AFF', fontWeight: '600', marginLeft: 4 }}>Mở</Text>
        </TouchableOpacity>
      )}

      {showDownload && (
        <TouchableOpacity onPress={downloadPDF} style={buttonStyle}>
          <Ionicons name="download-outline" size={18} color="#34C759" />
          <Text style={{ color: '#34C759', fontWeight: '600', marginLeft: 4 }}>Tải</Text>
        </TouchableOpacity>
      )}

      {showShare && (
        <TouchableOpacity onPress={sharePDF} style={buttonStyle}>
          <Ionicons name="share-social-outline" size={18} color="#FF9500" />
          <Text style={{ color: '#FF9500', fontWeight: '600', marginLeft: 4 }}>Chia sẻ</Text>
        </TouchableOpacity>
      )}

      {showPrint && (
        <TouchableOpacity onPress={printPDF} style={buttonStyle}>
          <Ionicons name="print-outline" size={18} color="#5856D6" />
          <Text style={{ color: '#5856D6', fontWeight: '600', marginLeft: 4 }}>In</Text>
        </TouchableOpacity>
      )}

      {showCopy && (
        <TouchableOpacity onPress={copyLink} style={buttonStyle}>
          <Ionicons name="copy-outline" size={18} color="#007AFF" />
          <Text style={{ color: '#007AFF', fontWeight: '600', marginLeft: 4 }}>Sao chép</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrderPDFActions;
