import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface SegData {
  franchise: string;
  size: string;
  stockType: string[];
  existingFinance: string;
}

export interface OnboardingState {
  id: string | null;
  dealerName: string;
  companyNumber: string;
  stage: string;
  status: string;
  segmentation: SegData;
  qualificationNotes: string;
  screeningResults: Record<string, string>;
  checklistProgress: Record<string, boolean[]>;
  failureReason: string | null;
}

const defaultSeg: SegData = { franchise: "", size: "", stockType: [], existingFinance: "" };

const defaultState: OnboardingState = {
  id: null,
  dealerName: "",
  companyNumber: "",
  stage: "pre-screening",
  status: "in_progress",
  segmentation: defaultSeg,
  qualificationNotes: "",
  screeningResults: {},
  checklistProgress: {},
  failureReason: null,
};

export function useOnboardingPersistence() {
  const { toast } = useToast();
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [applications, setApplications] = useState<OnboardingState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchAll = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("onboarding_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (data) {
        setApplications(data.map((r: any) => ({
          id: r.id,
          dealerName: r.dealer_name,
          companyNumber: r.company_number || "",
          stage: r.stage,
          status: r.status,
          segmentation: (r.segmentation as unknown as SegData) || defaultSeg,
          qualificationNotes: r.qualification_notes || "",
          screeningResults: (r.screening_results as unknown as Record<string, string>) || {},
          checklistProgress: (r.checklist_progress as unknown as Record<string, boolean[]>) || {},
          failureReason: r.failure_reason,
        })));
      }
    } catch {
      // Supabase auth not available in mock mode — gracefully degrade
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const loadApplication = useCallback((app: OnboardingState) => {
    setState(app);
  }, []);

  const createNew = useCallback(() => {
    setState(defaultState);
  }, []);

  const save = useCallback(async (partial?: Partial<OnboardingState>) => {
    const current = partial ? { ...state, ...partial } : state;
    if (!current.dealerName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setSaving(true);

      const payload = {
        user_id: user.id,
        dealer_name: current.dealerName,
        company_number: current.companyNumber || null,
        stage: current.stage,
        status: current.status,
        segmentation: current.segmentation as unknown as Json,
        qualification_notes: current.qualificationNotes || null,
        screening_results: current.screeningResults as unknown as Json,
        checklist_progress: current.checklistProgress as unknown as Json,
        failure_reason: current.failureReason,
      };

      if (current.id) {
        await supabase
          .from("onboarding_applications")
          .update(payload)
          .eq("id", current.id);
      } else {
        const { data } = await supabase
          .from("onboarding_applications")
          .insert(payload)
          .select("id")
          .single();
        if (data) {
          setState((s) => ({ ...s, id: data.id }));
        }
      }

      setSaving(false);
      fetchAll();
    } catch {
      setSaving(false);
    }
  }, [state, fetchAll]);

  const update = useCallback((partial: Partial<OnboardingState>) => {
    setState((s) => {
      const next = { ...s, ...partial };
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        save(partial);
      }, 1500);
      return next;
    });
  }, [save]);

  return {
    state,
    setState,
    applications,
    loading,
    saving,
    save,
    update,
    loadApplication,
    createNew,
    fetchAll,
  };
}
