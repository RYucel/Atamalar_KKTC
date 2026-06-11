import Papa from 'papaparse';
import { Appointment } from './types';

export const csvData = `Atama Tarihi,Atanan Kişi,Atandığı Mevki / Kadro,Bağlı Bulunduğu Kurum
10.03.2022,Hande Güzoğlu,Özel Kalem Müdürü,Bayındırlık ve Ulaştırma Bakanlığı
10.03.2022,Ersan Karataş,Bakanlık Müdürü,Maliye Bakanlığı
10.03.2022,Mehmet Ercilasun,Bakanlık Müdürü,Tarım ve Doğal Kaynaklar Bakanlığı
10.03.2022,Kamil Ağcabay,Özel Kalem Müdürü,Maliye Bakanlığı
10.03.2022,Mehmet Yulaf,Müsteşar,İçişleri Bakanlığı
16.03.2022,Berhan Ongan,Müsteşar,Çalışma ve Sosyal Güvenlik Bakanlığı
17.03.2022,Niyazi Öztürk,Bakanlık Müdürü,İçişleri Bakanlığı
17.03.2022,Mustafa Şenol Sütçü,Müdür,Başbakanlık - Spor Dairesi
17.03.2022,Mete Topçu,Müdür,Bayındırlık ve Ulaştırma Bak. - Posta Dairesi
17.03.2022,Osman Bora Çağakan,Bakanlık Müdürü,Ekonomi ve Enerji Bakanlığı
17.03.2022,Fatih Erdoğan,Müdür,İçişleri Bak. - Merkezi Cezaevi
17.03.2022,Kemal Şöföroğlu,Özel Kalem Müdürü,Milli Eğitim Bakanlığı
17.03.2022,Huriye Kutup,Kooperatif Şirketler Mukayyidi,"Turizm, Kültür, Gençlik ve Çevre Bakanlığı"
17.03.2022,Mehmet Kardan,Özel Kalem Müdürü,Ekonomi ve Enerji Bakanlığı
17.03.2022,İlgen Bağcıer,Özel Kalem Müdürü,İçişleri Bakanlığı
17.03.2022,Ahmet Aydın,Müdür,Bayındırlık ve Ulaştırma Bak. - Karayolları Dairesi
17.03.2022,Mustafa Yeşil,Müdür,Bayındırlık ve Ulaştırma Bak. - Trafik Dairesi
17.03.2022,Elmas Kavunoğlu,Müdür,Ekonomi ve Enerji Bak. - Sanayi Dairesi
17.03.2022,Emirali Çobanoğlu,Plan-Proje Müdürü,İçişleri Bakanlığı
28.03.2022,Revin Gürler,Bakanlık Müdürü,Milli Eğitim Bakanlığı
28.03.2022,Efsun Kaşif,Bakanlar Kurulu Genel Sekreteri,Başbakanlık
29.03.2022,Cengiz Topel Uzun,Müdür,Milli Eğitim Bak. - Genel Ortaöğretim Dairesi
29.03.2022,Halis Üresin,Genel Koordinatör,Maliye Bakanlığı
29.03.2022,Mine Emiroğlu,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Turizm Tanıtma ve Pazarlama Dairesi"
29.03.2022,Osman Şeker,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Turizm Planlama Dairesi"
02.04.2022,Cenk Dökmen,Yerel Yönetimler Müdürü,İçişleri Bakanlığı
02.04.2022,Bahar Öztay,Müdür,Dışişleri Bak. - Tanıtma Dairesi
02.04.2022,Mehmet Yalçın,Bakanlık Müdürü,"Turizm, Kültür, Gençlik ve Çevre Bakanlığı"
02.04.2022,Hasan Büyükoğlu,Müdür,Cumhuriyet Meclisi Genel Sekreterliği Örgütü
06.04.2022,Keziban Sivri Yılmaz,Bakanlık Müdürü,Dışişleri Bakanlığı
08.04.2022,Şirin Zaimağaoğlu,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Kültür Dairesi"
12.04.2022,Halil Talaykurt,Başkan,Başbakanlık Denetleme Kurulu
18.04.2022,Gökmen Davutoğlu,Müdür,Milli Eğitim Bak. - Eğitim Ortak Hizmetler Dairesi
18.04.2022,Behçet Çelebi,Müdür,Milli Eğitim Bak. - Yüksek Öğrenim ve Dışilişkiler Dairesi
23.05.2022,Sinan Sarıkaya,Resmi Kabz Memuru ve Şirketler Mukayyidi,Ekonomi ve Enerji Bakanlığı
03.06.2022,Osman Asilkan,Özel Kalem Müdürü,Çalışma ve Sosyal Güvenlik Bakanlığı
03.06.2022,Ergin Tertemiz,Bakanlık Müdürü,Sağlık Bakanlığı
03.06.2022,İlgen Bağcıer,Özel Kalem Müdürü,Başbakanlık
03.06.2022,Serdar Kiracıoğlu,Müdür,İçişleri Bak. - İskan ve Rehabilitasyon Dairesi
03.06.2022,Rıza Erseven,Müdür,Başbakanlık - Spor Dairesi
03.06.2022,Mustafa Mesut Ener,Müsteşar,İçişleri Bakanlığı
03.06.2022,Mert Osmanlar,Özel Kalem Müdürü,İçişleri Bakanlığı
16.06.2022,Berhan Ongan,Müsteşar,Başbakanlık
16.06.2022,Hüseyin Cahitoğlu,Başkan,İstatistik Kurumu
16.06.2022,Ayşen Kumsal,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Jeoloji ve Maden Dairesi"
16.06.2022,Saadet Hüdaverdi,Genel Koordinatör,Maliye Bakanlığı
16.06.2022,Vicdan Celaloğlu,Müdür,Maliye Bak. - Gelir ve Vergi Dairesi
16.06.2022,Sezai Emre,Müdür,Maliye Bak. - Hazine ve Muhasebe Dairesi
16.06.2022,Yusuf Kenan Yeşilleme,Müdür,Maliye Bak. - Devlet Emlak ve Malzeme Dairesi
16.06.2022,Halide Elçin Kurtarıcıoğulları,Özel Kalem Müdürü,Sağlık Bakanlığı
16.06.2022,Mehmet Çavuşoğlu,Özel Kalem Müdürü,Ekonomi ve Enerji Bakanlığı
01.07.2022,Hakan Özsaygın,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Gençlik Dairesi"
01.07.2022,Sevil Yönlüer,Müdür,Ekonomi ve Enerji Bak. - Ticaret Dairesi
01.07.2022,Sezgi Çobanoğlu Ballı,Müdür,Çalışma ve Sosyal Güvenlik Bak. - Çalışma Dairesi
07.07.2022,Burak Şoföroğlu,Müsteşar,Maliye Bakanlığı
29.07.2022,Kemal Köprülü,Müsteşar,Dışişleri Bakanlığı
29.07.2022,İsmet Korukoğlu,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
29.07.2022,Ufuk Turganer,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
29.07.2022,Damla Güçlü,Genel Müdür,Dışişleri Bakanlığı - Dışişleri Dairesi
31.07.2022,Mustafa Lakadamyalı,Müsteşar,Dışişleri Bakanlığı
31.07.2022,Damla Güçlü,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
31.07.2022,Gizem Alpman,Genel Müdür,Dışişleri Bakanlığı - Dışişleri Dairesi
31.07.2022,Umut Koldaş,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
31.07.2022,Kemal Köprülü,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
04.08.2022,Buket Kop,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
05.08.2022,Alsev Müderriszade,Müdür,Devlet Laboratuvarı Dairesi
05.08.2022,İbrahim Alkan,Özel Kalem Müdürü,"Turizm, Kültür, Gençlik ve Çevre Bakanlığı"
11.08.2022,Salih Güneş,Müdür,Tarım ve Doğal Kaynaklar Bak. - Orman Dairesi
16.08.2022,Serkan İlseven,Müsteşar,İçişleri Bakanlığı
16.08.2022,Sümer Kızıldere,Müdür,Maliye Bak. - Gelir ve Vergi Dairesi
16.08.2022,Oğuz Köse,Özel Kalem Müdürü,Çalışma ve Sosyal Güvenlik Bakanlığı
25.08.2022,Hüseyin Gültekin,Müsteşar,İçişleri Bakanlığı
25.08.2022,Niyazi Öztürk,Merkez Kaymakamı,İçişleri Bakanlığı
25.08.2022,Mehmet Ercilasun,Bakanlık Müdürü,İçişleri Bakanlığı
30.08.2022,Hürol Üşümüş,Başkan,DPÖ İzleme ve Koordinasyon Dairesi
30.08.2022,Durali Güçlüsoy,Müsteşar,Devlet Planlama Örgütü
30.08.2022,Ali Alioğlu,Müdür,İçişleri Bak. - Tapu ve Kadastro Dairesi
30.08.2022,Halil Sakallı,Müsteşar,İçişleri Bakanlığı
30.08.2022,Ecevit Alper,Müsteşar,Çalışma ve Sosyal Güvenlik Bakanlığı
02.09.2022,Mehmet Ali Hüdaverdi,Özel Kalem Müdürü,Sağlık Bakanlığı
08.09.2022,Salih Canseç,Genel Koordinatör,Maliye Bakanlığı
08.09.2022,Alev Ecevit,Müdür,Çalışma ve Sosyal Güvenlik Bak. - Sosyal Hizmetler Dairesi
12.09.2022,Erhan Akar,Müdür,İçişleri Bak. - Muhaceret Dairesi
17.09.2022,Mutlu Ateş,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Kıbrıs Türk Devlet Tiyatroları"
19.09.2022,Kemal Yılmaz,Müsteşar,İçişleri Bakanlığı
19.09.2022,Ergin Erçoban,Özel Kalem Müdürü,İçişleri Bakanlığı
27.09.2022,Soley Akçaba,Genel Sekreter,Kamu Hizmeti Komisyonu Dairesi
27.09.2022,Mehmet Kayan,Plan-Proje Müdürü,İçişleri Bakanlığı
27.09.2022,Çelebi Ilık,Kooperatif Şirketler Mukayyidi,"Turizm, Kültür, Gençlik ve Çevre Bakanlığı"
05.10.2022,Narin Yalıner Ataöz,Müdür,"Cumhuriyet Meclisi Genel Sekreterliği Örgütü - Basın, Dış İlişkiler ve Protokol"
05.10.2022,Gözde Muhtaroğlu,Üye,Başbakanlık Denetleme Kurulu
05.10.2022,Mustafa Yeşil,Müdür,Bayındırlık ve Ulaştırma Bak. - Karayolları Dairesi
07.10.2022,Ahmet Aydın,Müdür,Bayındırlık ve Ulaştırma Bak. - Trafik Dairesi
07.10.2022,İrem Uygun Soyşen,Özel Kalem Müdürü,Cumhuriyet Meclisi Genel Sekreterliği Örgütü
25.10.2022,Gürsel Gürbüz,Müdür,Para Kambiyo ve İnkişaf Sandığı İşleri Dairesi
25.10.2022,Yusuf Ersoy,Bakanlık Müdürü,Maliye Bakanlığı
01.11.2022,Ümral Volkan,Müdür,Başbakanlık - Basın ve Halkla İlişkiler
14.11.2022,Abdullah Aktolgalı,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Çevre Koruma Dairesi"
14.11.2022,Tankut Rıfkı,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Eski Eserler ve Müzeler Dairesi"
14.11.2022,Nazım Ced,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Kıbrıs Türk Devlet Tiyatroları Dairesi"
14.11.2022,Mazlum Kortaş,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Turizm Planlama Dairesi"
28.12.2022,Hüseyin Cahitoğlu,Müsteşar,Başbakanlık
17.08.2023,Serkan İlseven,Müsteşar,İçişleri Bakanlığı
17.08.2023,Sümer Kızıldere,Müdür,Maliye Bak. - Gelir ve Vergi Dairesi
17.08.2023,Oğuz Köse,Özel Kalem Müdürü,Çalışma ve Sosyal Güvenlik Bakanlığı
23.08.2023,Serkan İlseven,Müsteşar,Çalışma ve Sosyal Güvenlik Bakanlığı
25.08.2023,Hüseyin Gültekin,Müsteşar,İçişleri Bakanlığı
25.08.2023,Niyazi Öztürk,Merkez Kaymakamı,İçişleri Bakanlığı
25.08.2023,Mehmet Ercilasun,Bakanlık Müdürü,İçişleri Bakanlığı
09.09.2023,Salih Canseç,Genel Koordinatör,Maliye Bakanlığı
09.09.2023,Alev Ecevit,Müdür,Çalışma ve Sosyal Güvenlik Bak. - Sosyal Hizmetler Dairesi
19.09.2023,Kemal Yılmaz,Müsteşar,İçişleri Bakanlığı
19.09.2023,Ergin Erçoban,Özel Kalem Müdürü,İçişleri Bakanlığı
29.09.2023,Reşat Değirmenci,Bakanlık Müdürü,Tarım ve Doğal Kaynaklar Bakanlığı
12.10.2023,Osman Çağakan,Daire Müdürü,Cumhurbaşkanlığı
08.11.2023,Ercan Akerzurumlu,Müdür,Tarım ve Doğal Kaynaklar Bak. - Tarım Dairesi
14.11.2023,Huriye Kutup,Bakanlık Müdürü,Ekonomi ve Enerji Bakanlığı
30.11.2023,Sinan Güneş,Müdür,Bayındırlık ve Ulaştırma Bak. - Meteoroloji Dairesi
23.12.2023,Hamdi Turgut Vehbi,Müdür,Cumhurbaşkanlığı Basın ve Halkla İlişkiler
23.01.2024,Nurcan Kutay,Müdür,İçişleri Bakanlığı - Nüfus Kayıt Dairesi
04.02.2024,Sövüda Besimler,Başkan,İstatistik Kurumu
13.03.2024,Murat Soysal,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
13.03.2024,Adil Özyılkan,Müdür,Sağlık Bakanlığı - Yataklı Tedaviler Kurumları Dairesi
13.03.2024,Müjde İnançoğlu,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
13.03.2024,Tahir Serhat,Müsteşar,Çalışma ve Sosyal Güvenlik Bakanlığı
13.03.2024,İlter Ökter,Müdür,Çalışma ve Sosyal Güvenlik Bak. - Sosyal Sigortalar Dairesi
18.03.2024,Naciye Berna Bayur,Bakanlık Müdürü,Çalışma ve Sosyal Güvenlik Bakanlığı
20.03.2024,Ercan Poyraz,Müdür,Tarım ve Doğal Kaynaklar Bak. - Orman Dairesi
03.04.2024,Firdes Arıcı,Müdür,İçişleri Bakanlığı - Tapu ve Kadastro Dairesi
03.04.2024,Cemal Kuyucu,Kaymakam,İçişleri Bakanlığı - Lefkoşa Kaymakamlığı
03.04.2024,Ergin Erçoban,Müdür,İçişleri Bakanlığı - Sosyal Konut Dairesi
03.04.2024,Erdinç Akgür,Genel Sekreter,YÖDAK
03.04.2024,Salih Peköz,Müdür,Başbakanlık Dairesi
03.04.2024,Tarık Haydar,Müdür,Sağlık Bakanlığı - Devlet Laboratuvarı
03.04.2024,Senal Gürsoy,Müdür,Başbakanlık - Merkezi Mevzuat Dairesi
03.04.2024,Özlem Keskinoğlu,Müdür,Sağlık Bakanlığı - İlaç ve Eczacılık Dairesi
23.04.2024,Ramadan Öcal,Kooperatif Şirketler Mukayyidi,"Turizm, Kültür, Gençlik ve Çevre Bakanlığı"
23.04.2024,Mustafa Mesut Ener,Başkan,Dijital Dönüşüm ve Elektronik Devlet Kurumu
23.04.2024,Milhan Lakadamyalı,Müdür,"Cumhuriyet Meclisi Genel Sekreterliği Örgütü - Basın, Dış İlişkiler ve Protokol"
30.04.2024,Revin Gürler,Kaymakam,İçişleri Bakanlığı - Girne Kaymakamlığı
30.04.2024,Batu Beyit,Müsteşar,İçişleri Bakanlığı
30.04.2024,Nahide Kayan Eraslan,Başkan,Kamu Yönetimi ve İnsan Kaynakları Başkanlığı
28.05.2024,Evren Zeki Gücel,Müdür,Kamu Hizmeti Komisyonu Dairesi - İdari İşler ve Sicil İşleri
13.06.2024,Emsal Emirzadeoğluları,Müdür,Bayındırlık ve Ulaştırma Bak. - Limanlar Dairesi
27.07.2024,Emine Emel,Müdür,Eski Eserler ve Müzeler Dairesi
14.08.2024,Hüseyin Ozanoğlu,Müdür,Gençlik Dairesi
05.10.2024,Tuğşad Tülbentci,Müsteşar,Ekonomi ve Enerji Bakanlığı
19.10.2024,Sinan Öztekin,Müdür,Maliye Bak. - Gümrük ve Rüsumat Dairesi
23.11.2024,Mustafa Ambar,Bakanlık Müdürü,Bayındırlık ve Ulaştırma Bakanlığı
31.12.2024,Yusuf İnanıroğlu,Müdür,Milli Eğitim Bak. - Genel Orta Öğretim Dairesi
22.01.2025,Ercan Akerzurumlu,Müsteşar,Tarım ve Doğal Kaynaklar Bakanlığı
22.01.2025,Erkan Baştaş,Müdür,İçişleri Bakanlığı - Sosyal Konut Dairesi
22.01.2025,Ercan Beşerler,Müdür,İçişleri Bakanlığı - İskan ve Rehabilitasyon Dairesi
22.01.2025,Serdar Kiracıoğlu,Müdür,İçişleri Bakanlığı - Harita Dairesi
10.02.2025,Fatma Çiftçi,Müdür,Milli Arşiv ve Araştırma Dairesi
25.03.2025,Arkın Şansalan,Plan-Proje Müdürü,İçişleri Bakanlığı
25.03.2025,Cemal Orakçıoğlu,Kaymakam,İçişleri Bakanlığı - Lefke Kaymakamlığı
25.03.2025,Mehmet Kayan,Kaymakam,İçişleri Bakanlığı - Güzelyurt Kaymakamlığı
11.04.2025,Erhan Akar,Müdür,Cumhurbaşkanlığı Basın ve Halkla İlişkiler
11.04.2025,Murat Haydar,Müdür,Tarım ve Doğal Kaynaklar Bak. - Tarım Dairesi
17.05.2025,Erek Çağatay,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
17.05.2025,Gülşa Öneri Bayar,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
17.05.2025,Gülden Özkara,Başkan,Devlet Planlama Örgütü İzleme ve Koordinasyon Dairesi
29.05.2025,Lütfü Oflaz,Bakanlık Müdürü,Milli Eğitim Bakanlığı
29.05.2025,Şerife Beysan,Kooperatif Şirketler Mukayyidi,"Turizm, Kültür, Gençlik ve Çevre Bakanlığı"
01.08.2025,Niyazi Öztürk,Özel Kalem Müdürü,Çalışma ve Sosyal Güvenlik Bakanlığı
01.08.2025,Fadıl Keleş,Merkez Kaymakamı,İçişleri Bakanlığı
01.08.2025,Serap Topal,Başkan,Devlet Planlama Örgütü Sosyal Planlama Dairesi
01.08.2025,Ercan Beşerler,Özel Kalem Müdürü,İçişleri Bakanlığı
01.08.2025,Serdar Kiracıoğlu,Müdür,İçişleri Bakanlığı - İskan ve Rehabilitasyon Dairesi
01.08.2025,Murat Tuna Muştu,Bakanlık Müdürü,Tarım ve Doğal Kaynaklar Bakanlığı
01.08.2025,Gizem Alpman,Müdür / Temsilci,Dışişleri Bakanlığı - Dışişleri Dairesi
16.08.2025,Suat Yeldener,Müsteşar,İçişleri Bakanlığı
20.08.2025,Tülen Saner,Üye,Başbakanlık Denetleme Kurulu
20.08.2025,Mehmet Dana,Genel Müdür,Dışişleri Bakanlığı - Dışişleri Dairesi
24.08.2025,Onur Tümtürk,Üye,Başbakanlık Denetleme Kurulu
28.10.2025,Mustafa Ergüven,Özel Kalem Müdürü,Cumhurbaşkanlığı Dairesi
29.10.2025,Mehmet Dana,Müsteşar,Cumhurbaşkanlığı
29.10.2025,Beniz Uluer Kaymak,Genel Müdür,Dışişleri Bakanlığı - Dışişleri Dairesi
05.12.2025,Sezgi Çobanoğlu Ballı,Müsteşar,Çalışma ve Sosyal Güvenlik Bakanlığı
06.12.2025,Pembe Arifoğlu,Genel Koordinatör,Maliye Bakanlığı
06.12.2025,Sedat Yüce,Başkan,Devlet Planlama Örgütü Ekonomik Planlama Dairesi
11.12.2025,Derviş Bayraktar,Özel Kalem Müdürü,Çalışma ve Sosyal Güvenlik Bakanlığı
11.12.2025,Emrah Güven,Müdür,Çalışma ve Sosyal Güvenlik Bak. - Çalışma Dairesi
31.01.2026,Mehmet Ağa,Müsteşar,Devlet Planlama Örgütü
31.01.2026,Okan Donangil,Başkan,Başbakanlık Denetleme Kurulu
28.02.2026,Mehmet Ercilasun,Müsteşar,Başbakanlık ve Merkez Kuruluşu
25.03.2026,Mustafa Yaver,Bakanlık Müdürü,İçişleri Bakanlığı
23.04.2026,Yılmaz Altunterim,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Çevre Koruma Dairesi"
13.05.2026,Onur Tümtürk,Müdür,Para Kambiyo ve İnkişaf Sandığı İşleri Dairesi
13.05.2026,Pembe İnanç Unan Ersöz,Meclis Genel Sekreteri,Cumhuriyet Meclisi Genel Sekreterliği Örgütü
01.06.2026,Kemal Köprülü,Müsteşar,Dışişleri Bakanlığı
02.06.2026,Sinem Güreşcioğlu,Müdür,"Cumhuriyet Meclisi Genel Sekreterliği Örgütü (Yasalar, Kararlar ve Tutanaklar)"
03.06.2026,Murat Zeki Civelek,Yerel Yönetimler Müdürü,İçişleri Bakanlığı
03.06.2026,Cenk Dökmen,Genel Sekreter,YÖDAK
03.06.2026,Ayhan Türe,Üye,Başbakanlık Denetleme Kurulu
05.06.2026,Murad Aktuğ,Müsteşar,Milli Eğitim Bakanlığı
06.06.2026,Ayşe Güler Akın,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Kültür Dairesi"
06.06.2026,Serhan Egemen,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Turizm Tanıtma ve Pazarlama Dairesi"
06.06.2026,Emine Hilkat,Müdür,"Turizm, Kültür, Gençlik ve Çevre Bak. - Eski Eserler ve Müzeler Dairesi"`;

export function parseData(): Appointment[] {
  const result = Papa.parse(csvData.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => v.trim(),
  });
  
  return result.data.map((row: any) => ({
    date: row['Atama Tarihi'],
    person: row['Atanan Kişi'],
    position: row['Atandığı Mevki / Kadro'],
    institution: row['Bağlı Bulunduğu Kurum'],
  }));
}
