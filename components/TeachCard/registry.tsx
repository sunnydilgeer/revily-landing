import type { ComponentType } from "react";
import type { VisualBarRow, VisualModel } from "./types";

import { FractionRowsModel } from "./models/FractionRowsModel";
import { RemoveBarModel } from "./models/RemoveBarModel";
import { SimplifyBarModel } from "./models/SimplifyBarModel";
import { SplitBarModel } from "./models/SplitBarModel";
import { MultiplesModel } from "./models/MultiplesModel";
import { MixedToImproperModel } from "./models/MixedToImproperModel";
import { AddMixedNumbersModel } from "./models/AddMixedNumbersModel";
import { RepeatedFractionAdditionModel } from "./models/RepeatedFractionAdditionModel";
import { SubtractMixedNumbersModel } from "./models/SubtractMixedNumbersModel";
import { PartWholeBarsModel } from "./models/PartWholeBarsModel";
import { ExchangeSubtractMixedNumbersModel } from "./models/ExchangeSubtractMixedNumbersModel";
import { NodeEdgeFlowModel } from "./models/NodeEdgeFlowModel";
import { FlowStepsModel } from "./models/FlowStepsModel";
import { GroupPartitionModel } from "./models/GroupPartitionModel";
import { InverseGroupReconstructModel } from "./models/InverseGroupReconstructModel";
import { FractionAreaModel } from "./models/FractionAreaModel";
import { FractionSimplifyRegroupModel } from "./models/FractionSimplifyRegroupModel";
import { FractionCancelStepsModel } from "./models/FractionCancelStepsModel";
import { MixedNumberConvertMultiplyModel } from "./models/MixedNumberConvertMultiplyModel";
import { CommonDenominatorGroupsModel } from "./models/CommonDenominatorGroupsModel";
import { GroupUnitPartsByDivisorModel } from "./models/GroupUnitPartsByDivisorModel";
import { CountUnitFractionPartsModel } from "./models/CountUnitFractionPartsModel";
import { DivideShareModel } from "./models/DivideShareModel";
import { ReciprocalExchangeModel } from "./models/ReciprocalExchangeModel";
import { MixedNumberCommonDenominatorGroupsModel } from "./models/MixedNumberCommonDenominatorGroupsModel";
import { OperationChoiceCompareModel } from "./models/OperationChoiceCompareModel";
import { RelationshipClassifierGridModel } from "./models/RelationshipClassifierGridModel";
import { DecimalPlaceValueGridPairModel } from "./models/DecimalPlaceValueGridPairModel";
import { PercentageHundredSquarePairModel } from "./models/PercentageHundredSquarePairModel";
import { BenchmarkEquivalenceModel } from "./models/BenchmarkEquivalenceModel";
import { DecimalToPercentagePlaceShiftModel } from "./models/DecimalToPercentagePlaceShiftModel";
import { DecimalToFractionRegroupModel } from "./models/DecimalToFractionRegroupModel";
import { FractionToDecimalPlaceValueModel } from "./models/FractionToDecimalPlaceValueModel";
import { FractionRepartitionZoomModel } from "./models/FractionRepartitionZoomModel";
import { ShareRegroupQuarterGroupModel } from "./models/ShareRegroupQuarterGroupModel";
import { RepartitionHundredSquareImproperModel } from "./models/RepartitionHundredSquareImproperModel";
import { AlignedFractionDecimalPercentModel } from "./models/AlignedFractionDecimalPercentModel";
import { HundredRegroupImproperBarsModel } from "./models/HundredRegroupImproperBarsModel";
import { HundredthsCompareNumberLineModel } from "./models/HundredthsCompareNumberLineModel";
import { BarOrderWholePlusExtraModel } from "./models/BarOrderWholePlusExtraModel";
import { TripleFormModel } from "./models/TripleFormModel";

// ── The visual_model registry ─────────────────────────────────────────────
//
// This is the ONE place that wires a `visual_model.style` value to the
// component that renders it. To add a new teach-card diagram:
//   1. Add the new shape as a member of the VisualModel union in types.ts.
//   2. Write the component in models/YourNewModel.tsx (own file, own props).
//   3. Add one entry below with defineVisualModel(match, Component, mapProps).
// That's it — TeachCard itself (index.tsx) never needs to change again.
//
// Entries are tried in array order and the first match wins, exactly like
// the if/else-if chain this replaced. Order only matters for the ~3 style
// strings that are ambiguous on their own (see the comments on those
// entries below) — every other entry can match on `style` alone because
// each style string is otherwise unique.
//
// `match` is written as a TS type predicate (`vm is Extract<...>`), so
// `mapProps`'s `vm` parameter is fully narrowed and typo'd/renamed fields
// are caught by tsc — the same safety the old inline destructuring had,
// just data-driven instead of hardcoded.

type RegistryEntry = {
  match: (vm: VisualModel) => boolean;
  Component: ComponentType<any>;
  mapProps: (vm: any) => Record<string, unknown>;
};

function defineVisualModel<T extends VisualModel, P extends Record<string, unknown>>(
  match: (vm: VisualModel) => vm is T,
  Component: ComponentType<P>,
  mapProps: (vm: T) => P
): RegistryEntry {
  return {
    match,
    Component: Component as ComponentType<any>,
    mapProps: mapProps as (vm: any) => Record<string, unknown>,
  };
}

export const VISUAL_MODEL_REGISTRY: RegistryEntry[] = [
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "remove" }> => vm.style === "remove",
    RemoveBarModel,
    (vm) => ({
      denominator: vm.denominator,
      startNumerator: vm.startNumerator,
      removeCount: vm.removeCount,
      removeColor: vm.removeColor,
      resultColor: vm.resultColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "simplify" }> => vm.style === "simplify",
    SimplifyBarModel,
    (vm) => ({
      fromNumerator: vm.fromNumerator,
      fromDenominator: vm.fromDenominator,
      toNumerator: vm.toNumerator,
      toDenominator: vm.toDenominator,
      groupLabel: vm.groupLabel,
      transitionLabel: vm.transitionLabel,
      orientation: vm.orientation,
      fromColor: vm.fromColor,
      toColor: vm.toColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "split" }> => vm.style === "split",
    SplitBarModel,
    (vm) => ({
      fromNumerator: vm.fromNumerator,
      fromDenominator: vm.fromDenominator,
      toNumerator: vm.toNumerator,
      toDenominator: vm.toDenominator,
      splitLabel: vm.splitLabel,
      fromColor: vm.fromColor,
      toColor: vm.toColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "multiples" }> => vm.style === "multiples",
    MultiplesModel,
    (vm) => ({
      labelA: vm.labelA,
      listA: vm.listA,
      labelB: vm.labelB,
      listB: vm.listB,
      commonValues: vm.commonValues,
      firstCommon: vm.firstCommon,
      annotation: vm.annotation,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "mixedToImproper" }> => vm.style === "mixedToImproper",
    MixedToImproperModel,
    (vm) => ({
      wholeNumber: vm.wholeNumber,
      numerator: vm.numerator,
      denominator: vm.denominator,
      wholeColor: vm.wholeColor,
      fractionColor: vm.fractionColor,
      resultColor: vm.resultColor,
    })
  ),
  // NOTE: "addMixedNumbers" is a pre-existing DB naming collision between
  // two structurally different shapes (see the comment on this member in
  // types.ts) — discriminate on "addends" vs "groups", in that order.
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "addMixedNumbers"; addends: unknown }> =>
      vm.style === "addMixedNumbers" && "addends" in vm,
    AddMixedNumbersModel,
    (vm) => ({ addends: vm.addends, result: vm.result })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "addMixedNumbers"; groups: unknown }> =>
      vm.style === "addMixedNumbers" && "groups" in vm,
    RepeatedFractionAdditionModel,
    (vm) => ({
      groups: vm.groups,
      fractionNumerator: vm.fractionNumerator,
      fractionDenominator: vm.fractionDenominator,
      resultNumerator: vm.resultNumerator,
      groupColor: vm.groupColor,
      resultColor: vm.resultColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "subtractMixedNumbers" }> => vm.style === "subtractMixedNumbers",
    SubtractMixedNumbersModel,
    (vm) => ({
      startWhole: vm.startWhole,
      startNumerator: vm.startNumerator,
      denominator: vm.denominator,
      removeWhole: vm.removeWhole,
      removeNumerator: vm.removeNumerator,
      removeLabel: vm.removeLabel,
      startColor: vm.startColor,
      keepFractionColor: vm.keepFractionColor,
      resultColor: vm.resultColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "partWholeBars" }> => vm.style === "partWholeBars",
    PartWholeBarsModel,
    (vm) => ({ bars: vm.bars })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "exchangeSubtractMixedNumbers" }> =>
      vm.style === "exchangeSubtractMixedNumbers",
    ExchangeSubtractMixedNumbersModel,
    (vm) => ({
      originalWhole: vm.originalWhole,
      originalNumerator: vm.originalNumerator,
      denominator: vm.denominator,
      removeWhole: vm.removeWhole,
      removeNumerator: vm.removeNumerator,
      exchangeLabel: vm.exchangeLabel,
      removeLabel: vm.removeLabel,
      startColor: vm.startColor,
      originalFractionColor: vm.originalFractionColor,
      resultColor: vm.resultColor,
    })
  ),
  // NOTE: "flowSteps" is also overloaded — the MD-16 import used a
  // nodes/edges graph shape instead of this component's original
  // steps/arrowLabels shape (see types.ts). Check "nodes" first.
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "flowSteps"; nodes: unknown }> =>
      vm.style === "flowSteps" && "nodes" in vm,
    NodeEdgeFlowModel,
    (vm) => ({ nodes: vm.nodes, edges: vm.edges })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "flowSteps"; steps: unknown }> =>
      vm.style === "flowSteps" && "steps" in vm,
    FlowStepsModel,
    (vm) => ({ steps: vm.steps, arrowLabels: vm.arrowLabels, arrowColors: vm.arrowColors })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "groupPartition" }> => vm.style === "groupPartition",
    GroupPartitionModel,
    (vm) => ({
      wholeAmount: vm.wholeAmount,
      denominator: vm.denominator,
      groupValue: vm.groupValue,
      selectCount: vm.selectCount,
      resultValue: vm.resultValue,
      dotColor: vm.dotColor,
      highlightColor: vm.highlightColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "inverseGroupReconstruct" }> =>
      vm.style === "inverseGroupReconstruct",
    InverseGroupReconstructModel,
    (vm) => ({
      knownParts: vm.knownParts,
      knownTotal: vm.knownTotal,
      partValue: vm.partValue,
      totalParts: vm.totalParts,
      wholeValue: vm.wholeValue,
      knownColor: vm.knownColor,
      unknownColor: vm.unknownColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "fractionAreaModel" }> => vm.style === "fractionAreaModel",
    FractionAreaModel,
    (vm) => ({
      rows: vm.rows,
      columns: vm.columns,
      shadedColumns: vm.shadedColumns,
      selectedRows: vm.selectedRows,
      resultNumerator: vm.resultNumerator,
      resultDenominator: vm.resultDenominator,
      shadeColor: vm.shadeColor,
      selectColor: vm.selectColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "fractionSimplifyRegroup" }> =>
      vm.style === "fractionSimplifyRegroup",
    FractionSimplifyRegroupModel,
    (vm) => ({
      totalParts: vm.totalParts,
      shadedParts: vm.shadedParts,
      groupSize: vm.groupSize,
      resultNumerator: vm.resultNumerator,
      resultDenominator: vm.resultDenominator,
      shadeColor: vm.shadeColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "fractionCancelSteps" }> => vm.style === "fractionCancelSteps",
    FractionCancelStepsModel,
    (vm) => ({ steps: vm.steps })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "mixedNumberConvertMultiply" }> =>
      vm.style === "mixedNumberConvertMultiply",
    MixedNumberConvertMultiplyModel,
    (vm) => ({
      first: vm.first,
      second: vm.second,
      resultNumerator: vm.resultNumerator,
      resultDenominator: vm.resultDenominator,
      resultWhole: vm.resultWhole,
      firstColor: vm.firstColor,
      secondColor: vm.secondColor,
      resultColor: vm.resultColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "commonDenominatorGroups" }> =>
      vm.style === "commonDenominatorGroups",
    CommonDenominatorGroupsModel,
    (vm) => ({
      dividendNumerator: vm.dividendNumerator,
      dividendDenominator: vm.dividendDenominator,
      commonNumerator: vm.commonNumerator,
      commonDenominator: vm.commonDenominator,
      divisorNumerator: vm.divisorNumerator,
      divisorDenominator: vm.divisorDenominator,
      groupCount: vm.groupCount,
      splitLabel: vm.splitLabel,
      dividendColor: vm.dividendColor,
      commonColor: vm.commonColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "groupUnitPartsByDivisor" }> =>
      vm.style === "groupUnitPartsByDivisor",
    GroupUnitPartsByDivisorModel,
    (vm) => ({
      wholeCount: vm.wholeCount,
      partsPerWhole: vm.partsPerWhole,
      totalParts: vm.totalParts,
      groupSize: vm.groupSize,
      groupCount: vm.groupCount,
      unitLabel: vm.unitLabel,
      baseColor: vm.baseColor,
      groupColors: vm.groupColors,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "countUnitFractionParts" }> =>
      vm.style === "countUnitFractionParts",
    CountUnitFractionPartsModel,
    (vm) => ({
      wholeCount: vm.wholeCount,
      partsPerWhole: vm.partsPerWhole,
      total: vm.total,
      unitLabel: vm.unitLabel,
      wholeColors: vm.wholeColors,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "divideShare" }> => vm.style === "divideShare",
    DivideShareModel,
    (vm) => ({
      fromNumerator: vm.fromNumerator,
      fromDenominator: vm.fromDenominator,
      splitNumerator: vm.splitNumerator,
      splitDenominator: vm.splitDenominator,
      divisor: vm.divisor,
      shareNumerator: vm.shareNumerator,
      shareDenominator: vm.shareDenominator,
      splitLabel: vm.splitLabel,
      shareLabel: vm.shareLabel,
      fromColor: vm.fromColor,
      share1Color: vm.share1Color,
      share2Color: vm.share2Color,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "reciprocalExchange" }> => vm.style === "reciprocalExchange",
    ReciprocalExchangeModel,
    (vm) => ({
      fraction: vm.fraction,
      fractionReciprocal: vm.fractionReciprocal,
      wholeNumber: vm.wholeNumber,
      fractionColor: vm.fractionColor,
      reciprocalColor: vm.reciprocalColor,
      resultColor: vm.resultColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "mixedNumberCommonDenominatorGroups" }> =>
      vm.style === "mixedNumberCommonDenominatorGroups",
    MixedNumberCommonDenominatorGroupsModel,
    (vm) => ({
      wholePart: vm.wholePart,
      fractionNumerator: vm.fractionNumerator,
      fractionDenominator: vm.fractionDenominator,
      commonNumerator: vm.commonNumerator,
      commonDenominator: vm.commonDenominator,
      divisorNumerator: vm.divisorNumerator,
      divisorDenominator: vm.divisorDenominator,
      groupCount: vm.groupCount,
      assembleLabel: vm.assembleLabel,
      wholeColor: vm.wholeColor,
      fractionColor: vm.fractionColor,
      commonColor: vm.commonColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "operationChoiceCompare" }> =>
      vm.style === "operationChoiceCompare",
    OperationChoiceCompareModel,
    (vm) => ({
      multiplyPanel: vm.multiplyPanel,
      dividePanel: vm.dividePanel,
      multiplyColor: vm.multiplyColor,
      divideColor: vm.divideColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "relationshipClassifierGrid" }> =>
      vm.style === "relationshipClassifierGrid",
    RelationshipClassifierGridModel,
    (vm) => ({
      processSteps: vm.processSteps,
      highlightStep: vm.highlightStep,
      relationships: vm.relationships,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "decimalPlaceValueGridPair" }> =>
      vm.style === "decimalPlaceValueGridPair",
    DecimalPlaceValueGridPairModel,
    (vm) => ({
      tenthsModel: vm.tenthsModel,
      hundredthsModel: vm.hundredthsModel,
      tenthsColor: vm.tenthsColor,
      hundredthsColor: vm.hundredthsColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "percentageHundredSquarePair" }> =>
      vm.style === "percentageHundredSquarePair",
    PercentageHundredSquarePairModel,
    (vm) => ({
      mainModel: vm.mainModel,
      zeroPlaceholderModel: vm.zeroPlaceholderModel,
      mainColor: vm.mainColor,
      zeroPlaceholderColor: vm.zeroPlaceholderColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "benchmarkEquivalence" }> =>
      vm.style === "benchmarkEquivalence",
    BenchmarkEquivalenceModel,
    (vm) => ({
      benchmarkTable: vm.benchmarkTable,
      multipleBuild: vm.multipleBuild,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "decimalToPercentagePlaceShift" }> =>
      vm.style === "decimalToPercentagePlaceShift",
    DecimalToPercentagePlaceShiftModel,
    (vm) => ({
      hundredSquareModel: vm.hundredSquareModel,
      placeValueShift: vm.placeValueShift,
      squareColor: vm.squareColor,
      highlightColor: vm.highlightColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "decimalToFractionRegroup" }> =>
      vm.style === "decimalToFractionRegroup",
    DecimalToFractionRegroupModel,
    (vm) => ({
      placeValueTable: vm.placeValueTable,
      hundredSquareSimplification: vm.hundredSquareSimplification,
      squareColor: vm.squareColor,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "fractionToDecimalPlaceValue" }> =>
      vm.style === "fractionToDecimalPlaceValue",
    FractionToDecimalPlaceValueModel,
    (vm) => ({
      placeValueTable: vm.placeValueTable,
      placeholderZeroSequence: vm.placeholderZeroSequence,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "fractionRepartitionZoom" }> =>
      vm.style === "fractionRepartitionZoom",
    FractionRepartitionZoomModel,
    (vm) => ({
      stripRepartition: vm.stripRepartition,
      eighthsZoom: vm.eighthsZoom,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "shareRegroupQuarterGroup" }> =>
      vm.style === "shareRegroupQuarterGroup",
    ShareRegroupQuarterGroupModel,
    (vm) => ({
      sharingModel: vm.sharingModel,
      quarterGrouping: vm.quarterGrouping,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "repartitionHundredSquareImproper" }> =>
      vm.style === "repartitionHundredSquareImproper",
    RepartitionHundredSquareImproperModel,
    (vm) => ({
      repartitionModel: vm.repartitionModel,
      improperFractionModel: vm.improperFractionModel,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "alignedFractionDecimalPercent" }> =>
      vm.style === "alignedFractionDecimalPercent",
    AlignedFractionDecimalPercentModel,
    (vm) => ({
      properFractionModel: vm.properFractionModel,
      improperFractionModel: vm.improperFractionModel,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "hundredRegroupImproperBars" }> =>
      vm.style === "hundredRegroupImproperBars",
    HundredRegroupImproperBarsModel,
    (vm) => ({
      regroupingModel: vm.regroupingModel,
      improperFractionModel: vm.improperFractionModel,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "hundredthsCompareNumberLine" }> =>
      vm.style === "hundredthsCompareNumberLine",
    HundredthsCompareNumberLineModel,
    (vm) => ({
      hundredthsModel: vm.hundredthsModel,
      numberLineModel: vm.numberLineModel,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "barOrderWholePlusExtra" }> =>
      vm.style === "barOrderWholePlusExtra",
    BarOrderWholePlusExtraModel,
    (vm) => ({
      barOrderModel: vm.barOrderModel,
      wholePlusExtraModel: vm.wholePlusExtraModel,
    })
  ),
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { style: "tripleForm" }> => vm.style === "tripleForm",
    TripleFormModel,
    (vm) => ({
      tripleFormModel: vm.tripleFormModel,
      tripleFormAboveOneModel: vm.tripleFormAboveOneModel,
    })
  ),
  // MUST be last: this is the base "add" shape, whose `style` field is
  // optional and therefore isn't a reliable discriminator on its own —
  // it's only safe to fall back to "does this have a `rows` array of bar
  // rows" once every style-specific entry above has already had a chance
  // to match (fractionAreaModel also has a `rows` field, but it's a
  // number, not VisualBarRow[], so the Extract below correctly excludes
  // it — still, don't reorder this above the style-specific entries).
  defineVisualModel(
    (vm): vm is Extract<VisualModel, { rows: VisualBarRow[] }> =>
      "rows" in vm && Array.isArray((vm as { rows?: unknown }).rows),
    FractionRowsModel,
    (vm) => ({ rows: vm.rows })
  ),
];

export function resolveVisualModel(vm: VisualModel): RegistryEntry | undefined {
  return VISUAL_MODEL_REGISTRY.find((entry) => entry.match(vm));
}