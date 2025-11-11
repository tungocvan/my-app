import React from 'react';
import { View, TouchableOpacity, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import * as Print from 'expo-print';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL_IMG } from '../data/url';

const OrderFileActions = ({
  fileUrl,
  title = 'File',
  showOpen = true,
  showDownload = true,
  showShare = true,
  showCopy = true,
  showPrint = true,
}) => {
  const [loading, setLoading] = React.useState(false);

  const fullUrl = BASE_URL_IMG + '/' + fileUrl;
  const isPDF = fileUrl?.endsWith('.pdf');
  //console.log('isPDF:', isPDF);
  // -------------------------------------------------------------------
  // ✅ SHARE PDF (CHÍNH XÁC THEO CODE BẠN CUNG CẤP)
  // -------------------------------------------------------------------
  const sharePDF = async () => {
    try {
      setLoading(true);

      const fileName = fileUrl.split('/').pop() || 'order.pdf';
      const fileUri = FileSystem.documentDirectory + fileName;

      // Xóa file cũ nếu có
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      }

      // Fetch PDF binary
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentType = response.headers.get('Content-Type');
      if (!contentType?.includes('pdf')) throw new Error('Không phải file PDF hợp lệ');

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

      // Lưu PDF vào thư mục ứng dụng
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Chia sẻ PDF
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
      await Print.printAsync({ uri: fullUrl });
    } catch (error) {
      // Alert.alert('❌ Lỗi', 'Không thể in PDF.');
    }
  };

  // -------------------------------------------------------------------
  // ✅ SHARE EXCEL / FILE KHÁC
  // -------------------------------------------------------------------
  const shareFile = async () => {
    try {
      setLoading(true);

      const fileName = fileUrl.split('/').pop() || 'file.xlsx';
      const fileUri = FileSystem.documentDirectory + fileName;

      if (Platform.OS === 'ios') {
        await Linking.openURL(fullUrl);
        Alert.alert('Mở Safari', 'Chọn “Chia sẻ” → “Lưu vào Tệp” để tải file.');
        return;
      }

      const { uri } = await FileSystem.downloadAsync(fullUrl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Chia sẻ file',
        });
      }
    } catch (err) {
      Alert.alert('❌ Lỗi', 'Không thể chia sẻ/tải file.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // ✅ OPEN FILE
  // -------------------------------------------------------------------
  const openFile = async () => {
    try {
      await Linking.openURL(fullUrl);
    } catch {
      Alert.alert('❌ Lỗi', 'Không thể mở file.');
    }
  };

  // -------------------------------------------------------------------
  // ✅ COPY LINK
  // -------------------------------------------------------------------
  const copyLink = async () => {
    await Clipboard.setStringAsync(fullUrl);
    Alert.alert('✅ Đã sao chép', 'Đường dẫn đã được copy.');
  };

  // -------------------------------------------------------------------
  // ✅ UI BUTTONS
  // -------------------------------------------------------------------
  const buttonStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 6,
    marginTop: 6,
  };

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 6 }}>{title}</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {loading && <ActivityIndicator size="small" color="#007AFF" />}

        {showOpen && (
          <TouchableOpacity onPress={openFile} style={buttonStyle}>
            <Ionicons name="open-outline" size={18} color="#007AFF" />
            <Text style={{ marginLeft: 4, color: '#007AFF' }}>Mở</Text>
          </TouchableOpacity>
        )}

        {showShare && (
          <TouchableOpacity onPress={isPDF ? sharePDF : shareFile} style={buttonStyle}>
            <Ionicons name="share-social-outline" size={18} color="#34C759" />
            <Text style={{ marginLeft: 4, color: '#34C759' }}>Chia sẻ</Text>
          </TouchableOpacity>
        )}
        {showPrint && (
          <TouchableOpacity onPress={printPDF} style={buttonStyle}>
            <Ionicons name="share-social-outline" size={18} color="#34C759" />
            <Text style={{ marginLeft: 4, color: '#34C759' }}>In</Text>
          </TouchableOpacity>
        )}

        {showCopy && (
          <TouchableOpacity onPress={copyLink} style={buttonStyle}>
            <Ionicons name="copy-outline" size={18} color="#007AFF" />
            <Text style={{ marginLeft: 4, color: '#007AFF' }}>Copy link</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OrderFileActions;
