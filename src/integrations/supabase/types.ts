export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          allowances: number
          avatar_url: string | null
          basic_salary: number
          created_at: string
          department: string
          email: string
          employee_id: string
          hra: number
          id: string
          join_date: string
          location: string | null
          name: string
          phone: string | null
          position: string
          status: string
          updated_at: string
        }
        Insert: {
          allowances?: number
          avatar_url?: string | null
          basic_salary?: number
          created_at?: string
          department: string
          email: string
          employee_id: string
          hra?: number
          id?: string
          join_date: string
          location?: string | null
          name: string
          phone?: string | null
          position: string
          status?: string
          updated_at?: string
        }
        Update: {
          allowances?: number
          avatar_url?: string | null
          basic_salary?: number
          created_at?: string
          department?: string
          email?: string
          employee_id?: string
          hra?: number
          id?: string
          join_date?: string
          location?: string | null
          name?: string
          phone?: string | null
          position?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          description: string | null
          employee_id: string
          id: string
          progress: number
          status: string
          target_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_id: string
          id?: string
          progress?: number
          status?: string
          target_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_id?: string
          id?: string
          progress?: number
          status?: string
          target_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string
          id: string
          interview_date: string
          interview_time: string
          interview_type: string
          interviewer_id: string
          notes: string | null
          score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          interview_date: string
          interview_time: string
          interview_type: string
          interviewer_id: string
          notes?: string | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          interview_date?: string
          interview_time?: string
          interview_type?: string
          interviewer_id?: string
          notes?: string | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string
          candidate_email: string
          candidate_name: string
          candidate_phone: string | null
          cover_letter: string | null
          experience_years: number
          id: string
          job_posting_id: string
          resume_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          candidate_email: string
          candidate_name: string
          candidate_phone?: string | null
          cover_letter?: string | null
          experience_years?: number
          id?: string
          job_posting_id: string
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          candidate_email?: string
          candidate_name?: string
          candidate_phone?: string | null
          cover_letter?: string | null
          experience_years?: number
          id?: string
          job_posting_id?: string
          resume_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          created_at: string
          department: string
          description: string | null
          id: string
          job_type: string
          location: string
          posted_date: string
          requirements: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          department: string
          description?: string | null
          id?: string
          job_type: string
          location: string
          posted_date?: string
          requirements?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          department?: string
          description?: string | null
          id?: string
          job_type?: string
          location?: string
          posted_date?: string
          requirements?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          days_count: number
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count: number
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          allowances: number
          basic_salary: number
          created_at: string
          deductions: number
          employee_id: string
          gross_pay: number
          hra: number
          id: string
          net_pay: number
          pay_period_end: string
          pay_period_start: string
          processed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          allowances: number
          basic_salary: number
          created_at?: string
          deductions?: number
          employee_id: string
          gross_pay: number
          hra: number
          id?: string
          net_pay: number
          pay_period_end: string
          pay_period_start: string
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          allowances?: number
          basic_salary?: number
          created_at?: string
          deductions?: number
          employee_id?: string
          gross_pay?: number
          hra?: number
          id?: string
          net_pay?: number
          pay_period_end?: string
          pay_period_start?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          areas_for_improvement: string | null
          created_at: string
          employee_id: string
          goals_progress: Json | null
          id: string
          overall_score: number
          review_date: string
          review_period: string
          reviewer_id: string
          status: string
          strengths: string | null
          updated_at: string
        }
        Insert: {
          areas_for_improvement?: string | null
          created_at?: string
          employee_id: string
          goals_progress?: Json | null
          id?: string
          overall_score: number
          review_date: string
          review_period: string
          reviewer_id: string
          status?: string
          strengths?: string | null
          updated_at?: string
        }
        Update: {
          areas_for_improvement?: string | null
          created_at?: string
          employee_id?: string
          goals_progress?: Json | null
          id?: string
          overall_score?: number
          review_date?: string
          review_period?: string
          reviewer_id?: string
          status?: string
          strengths?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
