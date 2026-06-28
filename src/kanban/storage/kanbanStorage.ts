import type { Task, TaskColumn, TaskStatus, ColumnDefinition } from "@/kanban/types";
import { TASK_STATUSES } from "@/kanban/types";

const STORAGE_KEY = "@simkuns/vue3-pinia-test/kanban";

const COLUMN_DEFINITIONS: readonly ColumnDefinition[] = [
  {
    id: "todo",
    title: "Darāms (Todo)",
  },
  {
    id: "in-progress",
    title: "Procesā (In Progress)",
  },
  {
    id: "done",
    title: "Pabeigts (Done)",
  },
];
const FALLBACK_TASKS: Task[] = [
  {
    id: "66055b91-f54d-4b18-abdf-dd69e638148b",
    title: "Izveidot pacientu sākotnējās novērtēšanas anketu",
    description:
      "Iekļaut jautājumus par simptomiem, hroniskām slimībām un lietotajiem medikamentiem.",
    status: "todo",
    createdAt: "2026-06-20T08:00:00Z",
    updatedAt: "2026-06-20T08:00:00Z",
  },
  {
    id: "85b13a08-d522-4fb2-87e6-28f95431ece7",
    title: "Sagatavot prasības asinsspiediena mērījumu importam",
    description: "Definēt datu formātu, mērījumu biežumu un validācijas noteikumus.",
    status: "in-progress",
    createdAt: "2026-06-20T09:15:00Z",
    updatedAt: "2026-06-24T13:10:00Z",
  },
  {
    id: "6d2787fb-6c42-445c-a903-33ba79d5ce5e",
    title: "Pārbaudīt laboratorijas rezultātu attēlošanu",
    description:
      "Pārliecināties, ka analīžu vērtības, mērvienības un references robežas tiek rādītas korekti.",
    status: "done",
    createdAt: "2026-06-20T10:30:00Z",
    updatedAt: "2026-06-21T15:45:00Z",
  },
  {
    id: "c627b8cc-1e51-4b63-8f66-1a131bfa798c",
    title: "Izveidot vizīšu pieraksta plūsmas prototipu",
    description: "Pacientam jāspēj izvēlēties ārstu, datumu, laiku un vizītes veidu.",
    status: "todo",
    createdAt: "2026-06-20T11:00:00Z",
    updatedAt: "2026-06-20T11:00:00Z",
  },
  {
    id: "b7cf7be6-6ab0-46f8-94e1-6712ce9d3850",
    title: "Ieviest pacientu ierīču reģistrēšanas formu",
    description: "Atbalstīt glikometrus, asinsspiediena mērītājus un pulsa oksimetrus.",
    status: "in-progress",
    createdAt: "2026-06-20T12:20:00Z",
    updatedAt: "2026-06-25T09:30:00Z",
  },
  {
    id: "995f8e22-2c2e-40b9-8333-9ada4a26ebdb",
    title: "Izveidot telemedicīnas vizīšu pārskatu",
    description: "Attēlot gaidāmās, pabeigtās un atceltās attālinātās konsultācijas.",
    status: "done",
    createdAt: "2026-06-21T07:50:00Z",
    updatedAt: "2026-06-22T14:05:00Z",
  },
  {
    id: "64ea65b7-74d6-417e-9069-2e49244e5dd8",
    title: "Pievienot radioloģijas attēlu augšupielādi",
    description: "Nodrošināt DICOM failu pievienošanu, metadatu nolasīšanu un drošu glabāšanu.",
    status: "todo",
    createdAt: "2026-06-21T08:40:00Z",
    updatedAt: "2026-06-21T08:40:00Z",
  },
  {
    id: "c2dd4402-c664-493a-9df1-ee6f12571b49",
    title: "Izstrādāt neatliekamības simptomu šķirošanas loģiku",
    description: "Definēt noteikumus, kas palīdz noteikt zemu, vidēju vai augstu pacienta risku.",
    status: "in-progress",
    createdAt: "2026-06-21T09:10:00Z",
    updatedAt: "2026-06-26T06:20:00Z",
  },
  {
    id: "a66c17ad-6fb0-467b-8ca7-17bec1d2aece",
    title: "Pārbaudīt zāļu lietošanas atgādinājumu darbību",
    description: "Testēt atgādinājumu laiku, atkārtošanos un pacienta apstiprinājuma plūsmu.",
    status: "done",
    createdAt: "2026-06-21T10:25:00Z",
    updatedAt: "2026-06-23T16:00:00Z",
  },
  {
    id: "b845ce9b-b456-42a6-80b5-4f225739e88e",
    title: "Sagatavot insulīna devu žurnāla ievades formu",
    description: "Pacientam jāspēj reģistrēt devu, laiku, glikozes līmeni un piezīmes.",
    status: "todo",
    createdAt: "2026-06-21T11:45:00Z",
    updatedAt: "2026-06-21T11:45:00Z",
  },
  {
    id: "de8c14aa-a91e-4fb0-aaa3-0fefd27830b0",
    title: "Izveidot ārsta brīdinājumu centru",
    description: "Vienā skatā attēlot kritiskus vitālos rādītājus un ierīču kļūdas.",
    status: "in-progress",
    createdAt: "2026-06-22T08:00:00Z",
    updatedAt: "2026-06-25T17:10:00Z",
  },
  {
    id: "d9730dfa-7b47-487c-b66b-aed1b7ff8aa1",
    title: "Ieviest audita pierakstus pacienta datu skatīšanai",
    description: "Saglabāt informāciju par lietotāju, darbību, laiku un skatīto pacienta ierakstu.",
    status: "done",
    createdAt: "2026-06-22T09:30:00Z",
    updatedAt: "2026-06-22T18:20:00Z",
  },
  {
    id: "d723e887-89de-4b19-a1fb-4c81157b64ef",
    title: "Izveidot pacienta piekrišanas formu datu apstrādei",
    description:
      "Iekļaut piekrišanu ārstniecībai, attālinātai uzraudzībai un datu nodošanai speciālistiem.",
    status: "todo",
    createdAt: "2026-06-22T10:40:00Z",
    updatedAt: "2026-06-22T10:40:00Z",
  },
  {
    id: "74cbcdca-03f7-493e-8ea1-e021879ee97b",
    title: "Testēt mājas medicīnas ierīču Bluetooth savienošanu",
    description: "Pārbaudīt savienošanu, atkārtotu pieslēgšanos un kļūdu paziņojumus.",
    status: "in-progress",
    createdAt: "2026-06-22T12:05:00Z",
    updatedAt: "2026-06-24T11:55:00Z",
  },
  {
    id: "86ee492d-d451-4262-a1cd-0e02f3a3537d",
    title: "Izveidot testa lietotājus slimnīcas personālam",
    description:
      "Sagatavot atsevišķus kontus ārstam, māsai, administratoram un laboratorijas speciālistam.",
    status: "done",
    createdAt: "2026-06-23T07:30:00Z",
    updatedAt: "2026-06-23T09:15:00Z",
  },
  {
    id: "fc8e978f-4063-47a0-a1d7-177bf987c0c9",
    title: "Aprakstīt kiberdrošības kontroles pacientu datiem",
    description:
      "Iekļaut piekļuves kontroli, šifrēšanu, sesiju pārvaldību un ierīču autentifikāciju.",
    status: "todo",
    createdAt: "2026-06-23T08:10:00Z",
    updatedAt: "2026-06-23T08:10:00Z",
  },
  {
    id: "f745d1f0-7643-4f71-8e92-4964a2a4fb39",
    title: "Sagatavot integrācijas testus e-veselības datiem",
    description: "Pārbaudīt pacienta profila, diagnožu, nosūtījumu un izmeklējumu datu apmaiņu.",
    status: "todo",
    createdAt: "2026-06-23T09:25:00Z",
    updatedAt: "2026-06-23T09:25:00Z",
  },
  {
    id: "f6998b78-efce-49e4-8a9f-12151af02312",
    title: "Analizēt pacientu mobilās lietotnes kļūdu ziņojumus",
    description:
      "Identificēt biežākās avārijas simptomu dienasgrāmatā un video konsultāciju sadaļā.",
    status: "in-progress",
    createdAt: "2026-06-23T11:00:00Z",
    updatedAt: "2026-06-26T07:05:00Z",
  },
  {
    id: "83ee8018-baf5-43bd-b888-a204cb3ff31a",
    title: "Pievienot daudzvalodu atbalstu pacientu norādījumiem",
    description: "Nodrošināt instrukcijas latviešu, angļu un krievu valodā.",
    status: "done",
    createdAt: "2026-06-24T08:15:00Z",
    updatedAt: "2026-06-24T15:30:00Z",
  },
  {
    id: "084c44fe-6b8b-43c1-8383-b42c4935d287",
    title: "Pārskatīt attālinātās pacientu uzraudzības darba plūsmu",
    description: "Aprakstīt, kā mērījumi nonāk pie ārsta un kad jāveido brīdinājums.",
    status: "todo",
    createdAt: "2026-06-24T09:40:00Z",
    updatedAt: "2026-06-24T09:40:00Z",
  },
  {
    id: "6bd6de80-ef83-498d-b727-4561a005cdaf",
    title: "Ieviest pacienta pamatdatu sinhronizāciju",
    description: "Sinhronizēt vārdu, personas kodu, kontaktinformāciju un ģimenes ārsta datus.",
    status: "in-progress",
    createdAt: "2026-06-24T10:50:00Z",
    updatedAt: "2026-06-25T16:45:00Z",
  },
  {
    id: "72f04efc-8294-4195-b20b-06927b4eb1cc",
    title: "Izveidot hronisko pacientu terapijas ievērošanas paneli",
    description: "Attēlot zāļu lietošanas regularitāti, mērījumu vēsturi un nokavētos uzdevumus.",
    status: "todo",
    createdAt: "2026-06-24T12:10:00Z",
    updatedAt: "2026-06-24T12:10:00Z",
  },
  {
    id: "c6916546-bc5c-41ce-b3bb-6f50585529ac",
    title: "Veikt pacientu portāla drošības pārbaudi",
    description:
      "Pārbaudīt autorizāciju, sesiju drošību, ievades validāciju un datu noplūdes riskus.",
    status: "done",
    createdAt: "2026-06-25T07:55:00Z",
    updatedAt: "2026-06-25T18:00:00Z",
  },
  {
    id: "866cb092-6497-4115-9b74-cff6a6735d94",
    title: "Sagatavot viedo infūzijas sūkņu ieviešanas plānu",
    description: "Definēt pilotnodaļas, personāla apmācību un drošības pārbaudes pirms ieviešanas.",
    status: "todo",
    createdAt: "2026-06-25T09:05:00Z",
    updatedAt: "2026-06-25T09:05:00Z",
  },
  {
    id: "4229fd87-cb3d-4cfa-b0bf-23044876b5f9",
    title: "Analizēt digitālās terapijas moduļa lietošanas statistiku",
    description: "Novērtēt aktivitāti, uzdevumu izpildi un pacientu iesaistes tendences.",
    status: "in-progress",
    createdAt: "2026-06-25T10:20:00Z",
    updatedAt: "2026-06-26T08:10:00Z",
  },
];

export function load(): TaskColumn[] {
  const rawValue = localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return createColumns(FALLBACK_TASKS);
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    const parsedColumns = parseColumns(parsed);

    if (parsedColumns) {
      return parsedColumns;
    }

    const parsedTasks = parseTasks(parsed);

    if (parsedTasks.length > 0) {
      return createColumns(parsedTasks);
    }
  } catch {
    return createColumns(FALLBACK_TASKS);
  }

  return createColumns(FALLBACK_TASKS);
}

export function save(columns: TaskColumn[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
}

function createColumns(tasks: Task[]): TaskColumn[] {
  return COLUMN_DEFINITIONS.map((column) => ({
    ...column,
    tasks: tasks
      .filter((task) => task.status === column.id)
      .map((task) => ({
        ...task,
        status: column.id,
      })),
  }));
}

function parseColumns(value: unknown): TaskColumn[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const columns = value
    .map((item) => parseColumn(item))
    .filter((column): column is TaskColumn => column !== null);

  if (columns.length !== COLUMN_DEFINITIONS.length) {
    return null;
  }

  return COLUMN_DEFINITIONS.map((definition) => {
    const column = columns.find((item) => item.id === definition.id);

    return {
      ...definition,
      tasks: column?.tasks ?? [],
    };
  });
}

function parseColumn(value: unknown): TaskColumn | null {
  if (!isRecord(value) || !isTaskStatus(value.id)) {
    return null;
  }

  const definition = COLUMN_DEFINITIONS.find((column) => column.id === value.id);

  if (!definition) {
    return null;
  }

  const tasks = parseTasks(value.tasks).map((task) => ({
    ...task,
    status: definition.id,
  }));

  return {
    ...definition,
    tasks,
  };
}

function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => parseTask(item)).filter((task): task is Task => task !== null);
}

function parseTask(value: unknown): Task | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = typeof value.id === "string" || typeof value.id === "number" ? String(value.id) : null;
  const title = typeof value.title === "string" ? value.title.trim() : null;
  const description = typeof value.description === "string" ? value.description : "";
  const createdAt = typeof value.createdAt === "string" ? value.createdAt : null;
  const updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : null;
  const { status } = value;

  if (!id || !title || !createdAt || !updatedAt || !isTaskStatus(status)) {
    return null;
  }

  return {
    id,
    title,
    description,
    status,
    createdAt,
    updatedAt,
  };
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && TASK_STATUSES.includes(value as TaskStatus);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
