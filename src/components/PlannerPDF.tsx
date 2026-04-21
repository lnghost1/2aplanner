import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Registrar fontes se necessário. Por padrão, o React-PDF usa fontes padrão limitadas.
// Aqui vamos usar as fontes padrão, mas com weights diferentes.

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#050505',
    color: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoPlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoRed: {
    color: '#E50914',
  },
  subLogo: {
    fontSize: 8,
    color: '#888888',
    marginTop: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  clientLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #E50914',
  },
  clientLogoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    textTransform: 'uppercase',
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  tab: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 15,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabActive: {
    border: '2px solid #E50914',
  },
  focoLabel: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  focoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  focoSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  bulletList: {
    marginBottom: 30,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  bulletIcon: {
    color: '#E50914',
    marginRight: 10,
    fontSize: 12,
  },
  bulletText: {
    fontSize: 11,
    color: '#DDDDDD',
  },
  posicionamentoBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    border: '2px solid #FFCCCC',
    borderRadius: 5,
  },
  posLabel: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 5,
  },
  posText: {
    fontSize: 12,
    color: '#000000',
    fontStyle: 'italic',
    fontWeight: 'bold',
    lineHeight: 1.5,
  },
  
  // PAGE 2
  page2TitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  page2Title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E50914',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#E50914',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E50914',
    minHeight: 40,
    alignItems: 'center',
  },
  colSemana: {
    width: '15%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#E50914',
    justifyContent: 'center',
  },
  colTipo: {
    width: '25%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#E50914',
    justifyContent: 'center',
  },
  colFormato: {
    width: '15%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#E50914',
    justifyContent: 'center',
  },
  colTema: {
    width: '45%',
    padding: 8,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cellTextRed: {
    fontSize: 10,
    color: '#E50914',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellTextWhite: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellTextWhiteCaps: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export const PlannerPDF = ({ clientName, month, campaignFocus, posts }: any) => {
  // Divisão de semanas: 4 semanas por mês normalmente.
  const postsPerWeek = Math.ceil(posts.length / 4) || 2;

  return (
    <Document>
      {/* PÁGINA 1: ESTRATÉGIA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoPlaceholder}>
            2A<Text style={styles.logoRed}>.</Text>
          </Text>
          <Text style={styles.subLogo}>ASSESSORIA DE MARKETING</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.clientLogoPlaceholder}>
            <Text style={styles.clientLogoText}>LOGO</Text>
          </View>
          <Text style={styles.clientName}>{clientName || 'NOME DO CLIENTE'}</Text>
        </View>

        <View style={styles.tabsRow}>
          <View style={[styles.tab, styles.tabActive]}>
            <Text>{month ? month.toUpperCase() : 'MÊS 1'}</Text>
          </View>
        </View>

        <Text style={styles.focoLabel}>FOCO ESTRATÉGICO</Text>
        <Text style={styles.focoTitle}>ORGANIZAR PRESENÇA E GERAR AUTORIDADE</Text>
        <Text style={styles.focoSubtitle}>RECONHECIMENTO & CONFIANÇA NA REGIÃO</Text>

        <View style={styles.bulletList}>
          {campaignFocus ? (
             <View style={styles.bulletItem}>
               <Text style={styles.bulletIcon}>✓</Text>
               <Text style={styles.bulletText}>{campaignFocus}</Text>
             </View>
          ) : (
            <>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>Gerar reconhecimento da marca em toda a região de atuação.</Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>Mostrar a operação real para construir confiança com o público.</Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>Gerar fluxo de mensagens qualificadas voltadas à conversão.</Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletIcon}>✓</Text>
                <Text style={styles.bulletText}>Posicionar a empresa como referência incontestável no setor.</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.posicionamentoBox}>
          <Text style={styles.posLabel}>POSICIONAMENTO</Text>
          <Text style={styles.posText}>
            "Posicionar a {clientName} como a escolha definitiva e referência máxima no seu setor, sendo reconhecida pela agilidade, confiança e proximidade com o cliente. Destacar os grandes diferenciais operacionais para reduzir incertezas comuns do mercado."
          </Text>
        </View>
      </Page>

      {/* PÁGINA 2: CALENDÁRIO */}
      <Page size="A4" style={styles.page}>
        <View style={styles.page2TitleRow}>
          <Text style={styles.page2Title}>PLANNER MENSAL</Text>
          <View style={{ alignItems: 'flex-end' }}>
             <Text style={styles.logoPlaceholder}>
               2A<Text style={styles.logoRed}>.</Text>
             </Text>
             <Text style={styles.subLogo}>ASSESSORIA DE MARKETING</Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <View style={styles.colSemana}><Text style={styles.headerText}>SEMANA</Text></View>
            <View style={styles.colTipo}><Text style={styles.headerText}>TIPO</Text></View>
            <View style={styles.colFormato}><Text style={styles.headerText}>FORMATO</Text></View>
            <View style={styles.colTema}><Text style={styles.headerText}>TEMA</Text></View>
          </View>

          {/* Rows */}
          {posts.map((post: any, index: number) => {
             const semana = Math.floor(index / postsPerWeek) + 1;
             
             // Extrair tipo de conteúdo do post com base na estratégia ou gerar algo genérico
             let tipo = "RECONHECIMENTO";
             if (post.strategy?.toLowerCase().includes("autoridade")) tipo = "AUTORIDADE";
             else if (post.format?.toLowerCase().includes("venda") || post.strategy?.toLowerCase().includes("convers")) tipo = "CONVERSÃO";
             
             // Formato
             let formato = "POST";
             if (post.format?.toLowerCase().includes("reels") || post.format?.toLowerCase().includes("víd") || post.format?.toLowerCase().includes("vid")) {
               formato = "VÍDEO";
             }

             return (
              <View style={styles.tableRow} key={index}>
                <View style={styles.colSemana}>
                  <Text style={styles.cellTextRed}>Semana {semana}</Text>
                </View>
                <View style={styles.colTipo}>
                  <Text style={styles.cellTextWhiteCaps}>{tipo}</Text>
                </View>
                <View style={styles.colFormato}>
                  <Text style={styles.cellTextWhiteCaps}>{formato}</Text>
                </View>
                <View style={styles.colTema}>
                  <Text style={styles.cellTextWhite}>{post.topic}</Text>
                </View>
              </View>
             );
          })}
        </View>
      </Page>
    </Document>
  );
};
