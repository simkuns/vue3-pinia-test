# Kanban Lite

Neliela uzdevumu pārvaldības lietotne ar `Vue 3`, `Composition API`, `Pinia` un `TypeScript`.

## Palaišana

```bash
npm install
npm run dev
```

## Funkcionalitāte

- Jauna uzdevuma izveide
- Uzdevuma rediģēšana
- Uzdevuma pārvietošana starp kolonnām ar drag-and-drop
- Uzdevuma dzēšana ar apstiprinājuma dialogu
- Filtrēšana pēc teksta
- Filtrēšana pēc statusa
- Datu saglabāšana `localStorage`

## Tehnoloģijas

- `Vue 3` ar `script setup` un `Composition API`
- `Pinia` globālajam stāvoklim
- `TypeScript` bez `any`
- `@dnd-kit/vue` uzdevumu pārvietošanai
- `Tailwind CSS` stilizācijai
- `Vite` izstrādes videi un būvēšanai

## Projekta struktūra

```text
src/
  kanban/
    components/   UI komponentes
    composables/  atkārtoti lietojama UI uzvedība
    stores/       Pinia store
    storage/      localStorage slānis
    types.ts      domēna tipi
    utils.ts      palīgfunkcijas drag-and-drop darbībām
```

## Arhitektūras lēmumi

### 1. Vienots stāvoklis ar Pinia

Visa galvenā biznesa loģika glabājas `src/kanban/stores/kanbanStore.ts`.

Šeit centralizēti tiek risinātas darbības ar uzdevumiem:

- `createTask`
- `updateTask`
- `deleteTask`
- filtrēšana
- gala kolonnu stāvokļa saglabāšana pēc drag-and-drop
- statusu sinhronizācija pēc drag-and-drop pabeigšanas

Šāds sadalījums ļauj UI komponentēm palikt pēc iespējas “dumjākām”: tās galvenokārt attēlo datus un emitē notikumus, bet biznesa noteikumi paliek vienā vietā.

### 2. Komponenšu sadalījums pēc atbildības

Skats ir sadalīts mazākās komponentēs ar skaidru atbildību:

- `KanbanView.vue` koordinē visu ekrānu, dialogus un notikumu plūsmu
- `KanbanToolbar.vue` atbild par filtriem un pogu jauna uzdevuma izveidei
- `KanbanBoard.vue` satur drag-and-drop provider un kolonnu renderēšanu
- `KanbanColumn.vue` attēlo vienu statusa kolonnu
- `KanbanCard.vue` attēlo vienu uzdevuma kartīti
- `KanbanDialogCreateEdit.vue` apstrādā izveides un rediģēšanas formu
- `KanbanDialogDeleteConfirm.vue` nodrošina drošu dzēšanas apstiprinājumu

Tas samazina savstarpējo sasaisti un vienkāršo uzturēšanu.

### 3. Stingra tipēšana domēna līmenī

`src/kanban/types.ts` satur visus galvenos domēna tipus:

- `Task`
- `TaskDraft`
- `TaskStatus`
- `TaskFilters`
- `TaskColumn`

Statusi ir definēti ar `as const`, lai iegūtu šauru tipu (`"todo" | "in-progress" | "done"`), nevis brīvu string vērtību kopu. Tas samazina kļūdu iespēju store un komponentēs.

### 4. localStorage kā atsevišķs persistences slānis

Darbs ar `localStorage` ir izdalīts failā `src/kanban/storage/kanbanStorage.ts`, nevis sajaukts ar UI komponentēm.

Tur ir divi svarīgi lēmumi:

- `load()` mēģina validēt ielādētos datus un bojātu formātu gadījumā atgriežas pie droša fallback
- `save()` saglabā pilnu kolonnu stāvokli, un store to izsauc automātiski caur `watch(columns, save, { deep: true })`

Tas nozīmē, ka datu noturība ir caurspīdīga pārējai lietotnei un nav jāatkārto saglabāšanas loģika dažādās vietās.

### 5. Drag-and-drop ar transient UI stāvokli

Uzdevumu pārvietošanai tiek izmantots `@dnd-kit/vue`. Store glabā kolonnas kā uzdevumu sarakstus pa statusiem, kas labi atbilst Kanban UI modelim.

Drag-and-drop plūsma ir šāda:

- `drag-start` brīdī `KanbanView` izveido lokālu `transientColumns` kopiju
- `drag-over` laikā tiek pārrēķināta tikai lokālā secība, nepārrakstot `Pinia store`
- `drag-end` brīdī store saņem tikai gala rezultātu caur `commitDraggedColumns`
- atceltas darbības gadījumā transient stāvoklis vienkārši tiek izmests

Šāds lēmums nošķir īslaicīgo UI stāvokli no persistētā domēna stāvokļa un novērš nevajadzīgu `localStorage` rakstīšanu uz katru `drag-over` notikumu.

### 6. Filtrēšana kā atvasināts stāvoklis

Filtri tiek glabāti store, bet filtrētie dati tiek iegūti ar `computed` (`filteredColumns`), nevis dublēti atsevišķā stāvoklī.

Ieguvumi:

- nav jāsinhronizē divi dažādi datu avoti
- filtrēšanas loģika ir vienuviet
- vienkāršāk uzturēt paredzamu datu plūsmu

### 7. Accessibility kā arhitektūras daļa

Dialogu pieejamībai ir izdalīts atsevišķs composable `src/kanban/composables/useDialogA11y.ts`.

Tas centralizē šādu uzvedību:

- fokusa iestatīšanu, atverot dialogu
- fokusa noturēšanu dialoga robežās (`focus trap`)
- `Escape` taustiņa apstrādi aizvēršanai
- iepriekšējā fokusa atjaunošanu pēc aizvēršanas
- `Enter` apstiprinājumu dzēšanas dialogā

Šī pieeja novērš pieejamības loģikas dublēšanu komponentēs un padara dialogu uzvedību konsekventu.

Papildus tam interaktīvie elementi ir veidoti ar semantiskiem HTML elementiem:

- uzdevuma kartītes rediģēšana izmanto `button`, nevis klikšķināmu `div`
- dialogiem ir `role="dialog"` vai `role="alertdialog"`
- formai un filtriem ir sasaistīti `label` un `id`

### 8. UX lēmumi

Lietotāja pieredzei pieņemti vairāki praktiski lēmumi:

- izveides/rediģēšanas forma neļauj saglabāt tukšu nosaukumu
- dzēšana notiek tikai pēc apstiprinājuma
- dzēšanas dialogu var apstiprināt ar `Enter`, bet abus dialogus aizvērt ar `Escape`
- aktīvu filtru gadījumā uzdevumu drag-and-drop ir atslēgts, lai neradītu neskaidru vai maldinošu pārvietošanas loģiku filtrētā skatā
- kartītē tiek rādīts, vai uzdevums ir izveidots vai atjaunots, izmantojot lokalizētu datuma formātu `lv-LV`
- mobilajā skatā kolonnas ir horizontāli ritināmas, lai saglabātu lietojamību mazākos ekrānos

## Datu plūsma

1. Lietotne ielādē sākotnējo stāvokli no `localStorage`
2. `Pinia store` glabā persistēto kolonnu un filtru stāvokli
3. Komponentes lasa store datus caur `storeToRefs`
4. Drag-and-drop laikā `KanbanView` uztur atsevišķu transient UI stāvokli
5. Tikai pēc pabeigta drag store saņem gala kolonnu stāvokli
6. Store izmaiņas automātiski tiek saglabātas `localStorage`

## Papildu piezīmes

- Sākotnējai demonstrācijai ir iekļauti fallback dati, ja `localStorage` ir tukšs vai bojāts
- `App.vue` apzināti ir ļoti plāns un tikai ielādē galveno `KanbanView`, lai Kanban moduli būtu viegli paplašināt vai pārnest
