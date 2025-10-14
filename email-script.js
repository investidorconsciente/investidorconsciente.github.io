/**
 * Script para enviar e-mail automaticamente quando uma nova resposta do Form for recebida.
 * Use gatilho "From spreadsheet -> On form submit".
 *
 * Configurações:
 * - EMAIL_FIELD_NAME: o cabeçalho da coluna que contém o e-mail no Sheets (ex.: "E-mail", "E-mail (opcional)").
 * - SUBJECT_TEMPLATE / BODY_TEMPLATE: templates do e-mail (pode usar placeholders {{NOME}} e {{EMAIL}} e outras colunas).
 * - MARCAR_COLUNA: nome da coluna que será usada para marcar "ENVIADO" para evitar reenvio.
 */

const EMAIL_FIELD_NAME = "E‑mail"; // ajuste para o texto EXATO do cabeçalho da sua planilha
const NAME_FIELD_NAME = "Nome completo"; // ajuste se quiser usar o nome no template
const MARCAR_COLUNA = "Email Enviado"; // coluna criada/atualizada para marcar envios

const SUBJECT_TEMPLATE = "Aqui está o seu eBook — Investidor Consciente";
const BODY_TEMPLATE = `
Olá {{NOME}},

Obrigado por se inscrever para receber o eBook "Estratégias para Investidores Conscientes".

Você pode baixar o eBook neste link:
https://seu-dominio-ou-link-para-ebook.exemplo/ebook.pdf

Se tiver dúvidas, responda este e-mail.

Um abraço,
Equipe Investidor Consciente
`;

/**
 * Função executada quando houver submissão no Spreadsheet.
 * Recebe o evento do trigger (e), mas também trabalhamos lendo a planilha para marcar envio.
 */
function onFormSubmitSendEmail(e) {
  try {
    // e.namedValues existe quando o trigger for do Form; quando for do Spreadsheet On Form Submit também deve existir.
    const namedValues = e.namedValues || {};
    // Obtém o e-mail a partir do namedValues
    const recipient = extractEmailFromNamedValues(namedValues);

    if (!recipient) {
      Logger.log("Nenhum e-mail encontrado na submissão. Ignorando.");
      return;
    }

    // Pega nome (se existir)
    const nome = (namedValues[NAME_FIELD_NAME] && namedValues[NAME_FIELD_NAME][0]) || "";

    // Monta subject/body substituindo placeholders
    const subject = SUBJECT_TEMPLATE.replace("{{NOME}}", nome).replace("{{EMAIL}}", recipient);
    const body = (BODY_TEMPLATE || "").replace("{{NOME}}", nome).replace("{{EMAIL}}", recipient);

    // Envia o e-mail (HTML opcional)
    GmailApp.sendEmail(recipient, subject, body, {
      htmlBody: body.replace(/\n/g, "<br>"),
      name: "Investidor Consciente"
    });

    // Marca a planilha (coluna MARCAR_COLUNA) como "ENVIADO" na linha correspondente
    markRowAsSent(e, "ENVIADO");

    Logger.log("E-mail enviado para: " + recipient);
  } catch (err) {
    Logger.log("Erro no envio automático: " + err);
  }
}

/**
 * Tenta extrair o e-mail do objeto namedValues usando EMAIL_FIELD_NAME como chave.
 * Se não encontrar, busca qualquer valor que pareça e-mail entre os namedValues.
 */
function extractEmailFromNamedValues(namedValues) {
  if (!namedValues || typeof namedValues !== "object") return null;

  // 1) Tentativa direta pelo nome do campo
  if (namedValues[EMAIL_FIELD_NAME] && namedValues[EMAIL_FIELD_NAME][0]) {
    return namedValues[EMAIL_FIELD_NAME][0].trim();
  }

  // 2) Procurar por qualquer campo cujo texto contenha 'e-mail' (case-insensitive)
  for (const key in namedValues) {
    if (/e-?mail/i.test(key) && namedValues[key] && namedValues[key][0]) {
      return namedValues[key][0].trim();
    }
  }

  // 3) Como fallback, procurar qualquer valor que pareça um e-mail (regex)
  const emailRegex = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/i;
  for (const key in namedValues) {
    const val = (namedValues[key] && namedValues[key][0]) || "";
    const m = val.match(emailRegex);
    if (m) return m[0];
  }

  return null;
}

/**
 * Marca a linha da submissão como 'ENVIADO' em uma coluna específica (cria a coluna se não existir).
 * e.range é a Range da linha (quando trigger do spreadsheet fornece).
 */
function markRowAsSent(e, markerText) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // Obtem cabeçalhos (primeira linha)
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    let colIndex = headers.indexOf(MARCAR_COLUNA) + 1; // +1 para converter em index base-1

    // Se a coluna não existir, criar no final e escrever o header
    if (colIndex === 0) {
      colIndex = sheet.getLastColumn() + 1;
      sheet.getRange(1, colIndex).setValue(MARCAR_COLUNA);
    }

    // Descobrir qual linha foi inserida:
    // e.range pode estar disponível (quando trigger é do spreadsheet). Caso contrário,
    // tentamos pegar a última linha com conteúdo (padrão).
    let rowNumber;
    if (e.range && e.range.getRow) {
      rowNumber = e.range.getRow();
    } else if (e && e.values) {
      // e.values está presente em alguns eventos (array de valores);
      // vamos tentar localizar a linha pela última ocorrência do timestamp (coluna 1 usualmente).
      rowNumber = sheet.getLastRow();
    } else {
      rowNumber = sheet.getLastRow();
    }

    // Escrever o marcador
    sheet.getRange(rowNumber, colIndex).setValue(markerText);
  } catch (err) {
    Logger.log("Erro ao marcar linha: " + err);
  }
}
