import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import * as Print from 'expo-print';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL_IMG, SEND_MAIL } from '../data/url';
import axiosClient from '../api/axiosClient';

const OrderFileActions = ({
  fileUrl,
  title = 'File',
  showOpen = true,
  showDownload = true,
  showShare = true,
  showCopy = true,
  showPrint = true,
  showSendMail = true,
}) => {
  const [loading, setLoading] = React.useState(false);
  const fullUrl = BASE_URL_IMG + '/' + fileUrl;
  const isPDF = fileUrl?.endsWith('.pdf');
  //console.log('isPDF:', isPDF);

  const [showModal, setShowModal] = React.useState(false);
  const [mailTo, setMailTo] = React.useState('hamadaqc01@gmail.com');
  const [subject, setSubject] = React.useState('test');
  const [body, setBody] = React.useState('body test');
  const [cc, setCc] = React.useState('');

  const [sending, setSending] = React.useState(false);

  const getFileBase64 = async () => {
    try {
      const fileName = fileUrl.split('/').pop() || 'file';
      const localUri = FileSystem.documentDirectory + fileName;

      // Delete old file
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(localUri, { idempotent: true });
      }

      // Download file
      const download = await FileSystem.downloadAsync(fullUrl, localUri);

      // Read base64
      const base64 = await FileSystem.readAsStringAsync(download.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Detect mime type
      let mime = 'application/octet-stream';
      if (fileName.endsWith('.pdf')) mime = 'application/pdf';
      if (fileName.endsWith('.xlsx'))
        mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      return {
        name: fileName,
        content: base64,
        mime,
      };
    } catch (err) {
      console.log('Lỗi getFileBase64:', err);
      return null;
    }
  };

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
  // ✅ COPY LINK
  // -------------------------------------------------------------------
  const sendMail = async () => {
    // tôi muốn sendmail ở đây, sau khi nhận được fullUrl tôi muốn đính kèm gửi mail
    // tôi muốn hiển modal input cho nhập địa chỉ email để gửi ở đây
    // lấy user_id đăng nhập ở đây
    // fullUrl là file đính kèm gửi mail
    // gọi api POST SEND_MAIL nhận
    setShowModal(true);
  };
  const confirmSendMail = async () => {
    // ✅ Validate bắt buộc
    if (!mailTo?.trim()) {
      Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập email người nhận.');
      return;
    }
    if (!subject?.trim()) {
      Alert.alert('⚠️ Thiếu thông tin', 'Vui lòng nhập tiêu đề email.');
      return;
    }

    try {
      setSending(true);

      // ✅ Lấy user_id từ AsyncStorage
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      // ✅ Xử lý CC thành array
      const ccList = cc
        ? cc
            .split(',')
            .map((email) => email.trim())
            .filter((e) => e)
        : [];

      // ✅ Payload gửi server (attachments là URL)
      const payload = {
        to: mailTo.trim(),
        subject: subject.trim(),
        body: body?.trim() || null,
        cc: ccList,
        attachments: [fullUrl], // đây là URL file từ props
      };

      console.log('📩 Payload gửi mail:', payload);

      // ✅ Gọi API
      await axiosClient.post(SEND_MAIL, payload);

      Alert.alert('🎉 Thành công', 'Email đã được đưa vào queue.');

      // ✅ Reset modal
      setShowModal(false);
      setMailTo('');
      setSubject('');
      setBody('');
      setCc('');
    } catch (err) {
      console.log('❌ Lỗi gửi mail:', err);
      Alert.alert('❌ Lỗi', 'Không gửi được email.');
    } finally {
      setSending(false);
    }
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
        {showSendMail && (
          <TouchableOpacity onPress={sendMail} style={buttonStyle}>
            <Ionicons name="copy-outline" size={18} color="#007AFF" />
            <Text style={{ marginLeft: 4, color: '#007AFF' }}>Send Mail</Text>
          </TouchableOpacity>
        )}
        {showModal && (
          <Modal
            visible={showModal}
            animationType="fade"
            transparent
            onRequestClose={() => setShowModal(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}
            >
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 20,
                  elevation: 10,
                }}
              >
                <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 12 }}>Gửi Email</Text>

                {/* Email nhận */}
                <Text>Email nhận:</Text>
                <TextInput
                  style={styles.input}
                  value={mailTo}
                  onChangeText={setMailTo}
                  placeholder="email@example.com"
                />

                {/* Subject */}
                <Text>Tiêu đề:</Text>
                <TextInput
                  style={styles.input}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Tiêu đề email"
                />

                {/* Body */}
                <Text>Nội dung (optional):</Text>
                <TextInput
                  multiline
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  value={body}
                  onChangeText={setBody}
                  placeholder="Nội dung email"
                />

                {/* CC */}
                <Text>CC (optional):</Text>
                <TextInput
                  style={styles.input}
                  value={cc}
                  onChangeText={setCc}
                  placeholder="email1@example.com, email2@example.com"
                />

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                  <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelBtn}>
                    <Text>Hủy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={confirmSendMail}
                    disabled={sending}
                    style={[styles.sendBtn, { opacity: sending ? 0.6 : 1 }]}
                  >
                    {sending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ color: '#fff' }}>Gửi</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
};

export default OrderFileActions;
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
});
