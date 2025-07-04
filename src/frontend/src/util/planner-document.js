import jsPDF from "jspdf";
import {ucwords} from "util/stdlib";
import dayjs from "dayjs";
import autoTable from "jspdf-autotable";


export const prepareData = (schedule) => {
    const doc = new jsPDF();

    const ingredientMap = {};
    let grandTotalCost = 0;
    const recipeScheduleGrouped = [];

    // Build ingredients map and prepare grouped recipe schedule
    schedule.forEach(({ date, slots }) => {
        slots.forEach(({ slot, recipes }) => {
            const slotEntries = recipes.map(recipe => {
                grandTotalCost += recipe.cost;

                recipe.recipe.ingredients.forEach(ingredient => {
                    const key = ingredient.id;
                    if (!ingredientMap[key]) {
                        ingredientMap[key] = {
                            name: ucwords(ingredient.name),
                            qty: 0,
                            qty_unit: ingredient.qty_unit,
                            unit_price: ingredient.unit_price
                        };
                    }

                    ingredientMap[key].qty += ingredient.qty;
                });

                return {
                    recipeName: recipe.recipe.name,
                    people: recipe.number_of_people
                };
            });

            recipeScheduleGrouped.push({
                date: dayjs(date).format('YYYY-MM-DD'),
                slot,
                rows: slotEntries
            });
        });
    });

    // Page 1: Grocery Summary
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('NomNomPlan Planner Document', 14, 20);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Weekly Grocery List', 14, 35);

    const ingredients = Object.values(ingredientMap);
    const groceryRows = ingredients.map((item, index) => {
        const totalCost = item.qty * item.unit_price;
        return [
            index + 1,
            item.name,
            `${item.qty.toFixed(2)} ${item.qty_unit}`,
            `Rs. ${item.unit_price.toFixed(2)} per ${item.qty_unit}`,
            `Rs. ${totalCost.toFixed(2)}`
        ];
    });

    autoTable(doc, {
        head: [['#', 'Ingredient', 'Total Qty', 'Unit Price', 'Total Cost']],
        body: groceryRows,
        startY: 45,
    });

    doc.setFontSize(14);
    doc.text(`Grand Total Cost: Rs. ${grandTotalCost.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);

    // Page 2: Recipe Schedule
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Recipe Schedule', 14, 20);

    const scheduleBodyRows = [];
    const rowSpans = [];

    recipeScheduleGrouped.forEach(({ date, slot, rows }) => {
        rows.forEach((row, idx) => {
            scheduleBodyRows.push([
                idx === 0 ? date : '',
                idx === 0 ? slot : '',
                row.recipeName,
                row.people
            ]);

            if (idx === 0 && rows.length > 1) {
                rowSpans.push(
                    { row: scheduleBodyRows.length - rows.length, col: 0, rowspan: rows.length },
                    { row: scheduleBodyRows.length - rows.length, col: 1, rowspan: rows.length }
                );
            }
        });
    });

    autoTable(doc, {
        head: [['Date', 'Slot', 'Recipe Name', 'People']],
        body: scheduleBodyRows,
        startY: 30,
        didDrawCell: function (data) {
            const span = rowSpans.find(
                s => s.row === data.row.index && s.col === data.column.index
            );
            if (span) {
                data.cell.rowSpan = span.rowspan;
            }
        }
    });

    return doc;
}
